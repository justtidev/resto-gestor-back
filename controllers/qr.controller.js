const QRCode = require("qrcode");

exports.generarQR = async (req, res) => {
  const { mesaId } = req.params;

  if (!mesaId) {
    return res.status(400).json({ error: "Falta el parámetro mesaId" });
  }

  const urlBase = process.env.QR_BASE_URL || "http://localhost:3000/menu";
  const urlConMesa = `${urlBase}?mesa=${mesaId}`;

  try {
    const qrImage = await QRCode.toDataURL(urlConMesa); // formato base64 PNG

    res.status(200).json({
      ok: true,
      mesaId,
      url: urlConMesa,
      qrBase64: qrImage,
    });
  } catch (error) {
    console.error("Error al generar QR:", error);
    res.status(500).json({ error: "Error al generar el QR" });
  }
};
