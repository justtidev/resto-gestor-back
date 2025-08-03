// controllers/aiController.js
const axios = require('axios');
const db = require("../models/index");
const { actualizar } = require('./comanda.controller');
const MenuItem = db.menuItem;
const Comanda = db.comanda;
const ComandaItem = db.comandaItem;

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`;

const conversacionesPorMesa = {}; // historial
const carritosPorMesa = {}; // productos detectados pendientes de confirmar

const llamarAGemini = async (contents) => {
  try {
    return await axios.post(API_URL, { contents }, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    if (error.response?.status === 503) {
      console.warn("🕒 Modelo saturado, reintentando en 1 segundo...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      return await axios.post(API_URL, { contents }, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    throw error;
  }
};

exports.askAndCreateComanda = async (req, res) => {
  const { question, MesaId, UsuarioId } = req.body;
  if (!question || !MesaId || !UsuarioId) {
    return res.status(400).json({ error: 'Faltan datos requeridos: question, MesaId o UsuarioId' });
  }

  try {
    const items = await MenuItem.findAll({ where: { disponible: true } });
    const menuTexto = items.map(item => `- ${item.nombre}: $${item.precio_item}`).join('\n');

    const prompt = `
Eres un Agente Virtual Argentina/o que toma pedidos de un restaurante . Tu tarea es interpretar los mensajes de los clientes (sentados en una mesa), sugerir productos del menú y tomar el pedido. Aquí tienes el menú actual:

${menuTexto}

Interpretá este mensaje del cliente y devolveme:

- Una respuesta textual amigable y natural para el cliente. Ejemplos:
  * "Perfecto, te agrego una Muzzarella. ¿Qué más te gustaría pedir?"
  * "Anotado la hamburguesa completa. ¿Deseás agregar algo más o confirmamos?"
  * "Genial. ¿Querés que te recomiende algo más o te confirmo el pedido?"
  * "¿Eso es todo o te gustaría pedir otra cosa?"

- Una estructura JSON con los productos detectados, como se muestra abajo.

⚠️ IMPORTANTE:

- Este es un restaurante físico, llamado "Resto", ubicado en Libertad 312, Santa Rosa de Calamuchita. El cliente ya está sentado en su mesa. No es necesario pedir dirección ni mencionar envío.

- NUNCA digas "Perfecto, el pedido fue confirmado. En breve será preparado." si la comanda no se ha creado. El pedido NO está confirmado hasta que el cliente diga claramente alguna de estas frases:
  * "confirmo", "es todo", "está bien","esta bien" "nada más","nada mas", "listo", "ya está", etc.
  Si lo dice, respondé: "Perfecto, el pedido fue confirmado. En breve será preparado."
  También podés agregar: "Nuestro mozo te lo acercará pronto."

- Si aún no hay confirmación, respondé amablemente invitando a confirmar o a seguir pidiendo. Evitá cerrar el pedido.

- El cliente NO debe ver el JSON. Es solo para el sistema.

- Si el mensaje es un saludo (como "hola", "buenas"), saludá cordialmente y ofrecé ayuda ("¿Querés hacer un pedido?", "¿Necesitás ayuda con el menú?"). 

- Si el cliente confirma el pedido, el sistema debe:
  1. Crear la comanda.
  2. Bloquear el chat (modal) y mostrar mensaje final del agente.
  3. Mostrar leyenda: "El pedido fue enviado. Un mozo seguirá atendiéndote."
4.Los precios $ del menu son en Pesos. NO usar la palabra "Dolares".
 Ejemplo Si te preguntan cuanto sale una hamburguesa contestas "La hamburguesa simple sale $5000 pesos".
Formato de la respuesta:

{
  "text": "Perfecto, una pizza Muzzarella. ¿Querés agregar algo más?",
  "items": [
    {
      "nombre": "Muzzarella",
      "cantidad": 1,
      "precio_unitario": 10500,
      "observaciones": ""
    }
  ]
}

Mensaje del cliente: "${question}"

Respondé siempre como si conocieras el estado actual del pedido. Si no podés interpretar el mensaje, pedí aclaración de forma natural, sin decir que sos una IA ni que no entendés bien.`;


// --- HISTORIAL POR MESA ---
    if (!conversacionesPorMesa[MesaId] || conversacionesPorMesa[MesaId].length === 0) {
      // Primer mensaje: prompt + pregunta
      conversacionesPorMesa[MesaId] = [{
        role: "user",
        content: `${prompt}\nMensaje del cliente: "${question}"`
      }];
    } else {
      // Mensaje normal
      conversacionesPorMesa[MesaId].push({ role: "user", content: question });
    }
    const historial = conversacionesPorMesa[MesaId];


  /*  Guardo el historial en contents para que la Api de Gemini lo entienda ya que reciben
   {
  "contents": [
    {
      "role": "user",
      "parts": [{ "text": "Hola" }]
    }
  ]
} */

  // --- ARMAR CONTENTS PARA GEMINI ---
    const contents = historial.map(m => ({
      role: m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    // --- LLAMADA A GEMINI ---
    const response = await llamarAGemini(contents);

   // --- OBTENER RESPUESTA DE GEMINI ---
    const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    if (!aiResponse) {
      return res.json({ question, answer: "No pude interpretar tu mensaje. ¿Podés reformularlo?" });
    }

    // Guardar respuesta de la IA en el historial
    historial.push({ role: "model", content: aiResponse });
    conversacionesPorMesa[MesaId] = historial;

       // Detectar confirmación
    const lowerMsg = question.toLowerCase();
   const frasesConfirmacion = [
  "confirmar", "es todo", "ya está","ya esta", "listo", "si confirmo", "confirmo", "eso es todo", "nada más","nada mas", "gracias"
];

const confirma = frasesConfirmacion.some(frase => lowerMsg.includes(frase));
console.log("🧾 Mensaje recibido:", question);
console.log("💬 confirmación detectada:", confirma);

// Si confirma, procesar el carrito 
    if (confirma) {
  const carrito = carritosPorMesa[MesaId];

  if (!carrito || carrito.length === 0) {
    return res.status(400).json({ text: "⚠️ No hay productos para confirmar.", ok: false });
  }
  //Se obtiene la comanda o se crea una nueva si no existe
      let comanda = await Comanda.findOne({ where: { MesaId, estado_Comanda: "Confirmada" } });
     
      if (!comanda) {
        comanda = await Comanda.create({ MesaId, UsuarioId, estado_Comanda: "Confirmada", precio_total:0 });
        const io = req.app.get("io");
io.emit("actualizarComandas");
io.emit("actualizarMesas");
      }else {
        await ComandaItem.destroy({ where: { ComandaId: comanda.id } });
       
      }
console.log("🛒 Carrito actual:", carritosPorMesa[MesaId]);
console.log("📦 Mensaje recibido:", question);
console.log("💬 Confirmación detectada:", confirma);
console.log("carrito", carrito)

let total=0;

for (const prod of carrito) {
  const item = items.find (i=> i.id === prod.id);
  if (!item) continue
  
  const subtotal = item.precio_item * prod.cantidad;
  total += subtotal;

   await ComandaItem.create({ ComandaId: comanda.id, MenuItemId: item.id, observaciones: prod.observaciones || "", precio_subtotal: subtotal, cantidad: prod.cantidad });
   

      }
      await comanda.update({ precio_total: total });
      delete carritosPorMesa[MesaId]; // Limpiar carrito después de confirmar
   const io = req.app.get("io");
io.emit("actualizarComandas");
io.emit("actualizarMesas");

 return res.status(201).json({
    text: "✅ Pedido confirmado. En breve será preparado. Nuestro mozo te lo acercará pronto.",
    comanda,
    chatBloqueado: true, // Esta bandera ahora está incluida
    ok: true});
    }

    // Busca JSON en bloque,``` json...```
    let jsonText = '';
    const match = aiResponse.match(/```json\s*([\s\S]*?)```/i);
    if (match) {
      jsonText = match[1];
    } else {
      // 2. Si no hay bloque, buscar un objeto JSON simple
      const altMatch = aiResponse.match(/{[\s\S]*}/);
      if (altMatch) jsonText = altMatch[0];
      // 3. Si no hay JSON, mostrar solo texto
      else return res.status(200).json({
      text: aiResponse.trim(),
      necesitaConfirmacion: false,
      ok: true
    });
    }

    // Parsear el JSON extraído
    let parsed= null;
    try {
      parsed = JSON.parse(jsonText.trim());
    } catch (err) {
       // No es un JSON, pero podría ser una respu
       // esta válida como un saludo
     return res.status(200).json({
    text: aiResponse.trim(),
    necesitaConfirmacion: false,
    ok: true
  });
}



//Obtiene la lista de ítems sugeridos por la IA del objeto parsed (el JSON de la IA) y el texto q se usara. Si no hay items, usa un array vacío.
    const productosIA = parsed.items || [];
    const textoVisible = parsed.text || aiResponse;

    const productosParaAgregar = [];

    for (const p of productosIA) {
      const item = items.find(i => i.nombre.toLowerCase() === p.nombre.toLowerCase());
      if (!item) continue;
      productosParaAgregar.push({
        id: item.id,
        cantidad: p.cantidad || 1,
        observaciones: p.observaciones || ""
      });
    }

    const carritoAnterior = carritosPorMesa[MesaId] || [];
    const carritoFusionado = [...carritoAnterior];

    for (const nuevo of productosParaAgregar) {
      const existente = carritoFusionado.find(p => p.id === nuevo.id && (p.observaciones || "") === (nuevo.observaciones || ""));
      if (existente) {
        existente.cantidad = nuevo.cantidad;
      } else {
        carritoFusionado.push(nuevo);
      }
    }

    carritosPorMesa[MesaId] = carritoFusionado;

    return res.status(200).json({ text: textoVisible, necesitaConfirmacion: productosIA.length > 0, ok: true });

  } catch (error) {
    const statusCode = error.response?.status || 500;
    const mensajeIA = error.response?.data?.error?.message || error.message;

    console.error("Error IA-Comanda:", error.response?.data || error.message);

    return res.status(statusCode).json({
      text: '⚠️ Ocurrió un error al procesar el pedido.',
      error: mensajeIA
    });
  }
};




















// Resetear memoria del chat para una mesa específica
exports.resetChat = (req, res) => {
  const { MesaId } = req.body;
  if (!MesaId) {
    return res.status(400).json({ error: "MesaId es requerido para resetear el chat." });
  }
  delete conversacionesPorMesa[MesaId];
  delete carritosPorMesa[MesaId];

  return res.status(200).json({ ok: true, mensaje: `Memoria del chat reseteada para mesa ${MesaId}` });
};

exports.agregarProductosIA = async (req, res) => {
  const id = req.params.id;
  const { productos } = req.body;

  if (!Array.isArray(productos)) {
    return res.status(400).json({ error: "Se requiere un array de productos." });
  }

  try {
    const comandaExistente = await db.comanda.findByPk(id, {
      include: [db.comandaItem],
    });

    if (!comandaExistente) {
      return res.status(404).json({ error: "Comanda no encontrada." });
    }

    let total = comandaExistente.precio_total || 0;

    for (const prod of productos) {
      const itemExistente = await db.comandaItem.findOne({
        where: {
          ComandaId: id,
          MenuItemId: prod.id
        }
      });

      const cantidadNueva = prod.cantidad || 1;
      const precioUnitario = prod.precio_unitario || 0;
      const subtotal = precioUnitario * cantidadNueva;

      if (itemExistente) {
        itemExistente.cantidad += cantidadNueva;
        itemExistente.precio_subtotal += subtotal;
        await itemExistente.save();
      } else {
        await db.comandaItem.create({
          ComandaId: id,
          MenuItemId: prod.id,
          cantidad: cantidadNueva,
          observaciones: prod.observaciones || "",
          precio_subtotal: subtotal
        });
      }

      total += subtotal;
    }

    await comandaExistente.update({ precio_total: total });

    const io = req.app.get("io");
    io.emit("actualizarComandas");
    io.emit("actualizarMesas")

    return res.status(200).json({
      ok: true,
      msg: "Productos agregados a la comanda.",
      data: comandaExistente
    });
  } catch (error) {
    console.error("Error al agregar productos:", error);
    return res.status(500).json({
      error: "Error interno al agregar productos a la comanda.",
      details: error.message
    });
  }
};

exports.askQuestion = async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'La pregunta es requerida en el cuerpo de la solicitud.' });
  }
  if (!GOOGLE_API_KEY) {
    console.error('Error: GOOGLE_API_KEY no está configurada.');
    return res.status(500).json({ error: 'Error de configuración del servidor: API Key no encontrada.' });
  }

  try {

const contents = historial
  .filter(m => m.role === "user" || m.role === "model")
  .map(m => ({
    role: m.role === "model" ? "model" : "user",
    parts: [{ text: m.content }]
  }));

const payload = {
  contents,
  temperature: 0.7
};

  const response = await axios.post(API_URL, payload, {
  headers: { 'Content-Type': 'application/json' }
});


    if (response.data && response.data.candidates?.[0]?.content?.content?.[0]?.text) {
      const aiResponse = response.data.candidates[0].content.content[0].text;
      res.json({ question, answer: aiResponse });
    } else {
      const reason = response.data?.promptFeedback?.blockReason || 'La respuesta de la IA no pudo ser procesada.';
      res.status(500).json({ error: reason, details: response.data });
    } 
  }catch (error) {
    console.error('Error al conectar con Google AI:', error.response?.data || error.message);
    if (error.response?.data?.error) {
      return res.status(error.response.status || 500).json({
        error: 'Error al procesar la solicitud con Google AI.',
        details: error.response.data.error.message
      });
    }
    res.status(500).json({ error: 'Error interno del servidor al conectar con Google AI.' });
  };
};
