const { where, Op } = require("sequelize");
const db = require("../models/index");
const menuItem = db.menuItem;

exports.obtenerTodos = (req, res) => {
  // const rgs = await producto.findAll();

  menuItem
    .findAll({
   include: [{
        model: db.categoria,
        // solo lo necesario
        // attributes: ['id', 'nombre'], 
        },
        { model: db.imagen,
        }
   ]
    })
  
    .then((registros) => {
      // res.send(registros);
    

      res.status(200).json({
        ok: true,
        msg: "Listado de Items",
        status: 200,
        data: registros,
      });
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al obtener los Items",
        status: 500,
        data: error,
      });
    });
};

exports.lista = (req,res) => {

  /*  const pagina = parseInt(req.query.pagina);
  const cantidad = parseInt(req.query.cantidad); */
const texto = req.query.filtro;
  const categoria = parseInt(req.query.categoria);
  const filtro = req.query.filtro;
  console.log("en metodo Lista llega la Categoria", categoria )
  console.log("en metodo Lista llega la FILTRO", filtro )
 


let whereFiltro={};

  if ((texto && texto.length > 0) || (categoria && categoria != 0 ) 
   
    ) 
    {

    whereFiltro[Op.and] = []; // where (   and    and    and )

    if (texto && texto.length > 0) {
      // aca vamos a agregar el filtro de texto
      whereFiltro[Op.and].push(
        {
        nombre: { [Op.like]: '%'+ texto +'%' },  // cambiar "nombre" por el campo de texto a buscar
        }
    )
    
    };

    if (categoria && categoria > 0) {
      // aca vamos a agregar el filtro de categorias
      

      whereFiltro[Op.and].push({
        CategoriumId: categoria   // cambiar categoriaId por el campo de categorias a buscar
    })

    };
    console.log("llega a lista", whereFiltro, texto, categoria, )
    
    console.log('Wherefiltro',whereFiltro)
  } 

 menuItem.findAll({
     where: whereFiltro,   
    include:[
           {
            model: db.categoria,
            
            } ,
            { 
              model: db.imagen,

            },
          

            
       ],  
      distinct: true,
     /*    offset: (pagina - 1) * cantidad,
       limit: cantidad  */
   }) 
  
  

/*    menuItem.findAndCountAll({
     where: whereFiltro,   
    include:[
           {
            model: db.categoria,
            
            } ,
            { 
              model: db.imagen,

            },
          

            
       ],  
      distinct: true,
        offset: (pagina - 1) * cantidad,
       limit: cantidad 
   }) */
.then((registros) => {
       console.log("envia registros")
       res.status(200).json({
           ok: true,
           msg: "Listado  ",
           status: 200,
           data: registros
       })
   })
   .catch((error) => {
       res.status(500).json({
           ok: false,
           msg: "Error al obtener el listado  ",
           status: 500,
           data: error
       })
   })
  }
exports.obtenerUno = (req, res) => {
  // obtener el parametro id
  const _id = req.params.id;

  menuItem
    .findOne({
      include: [
        {
          model: db.categoria,
          attributes:['nombre'],
        },
          
          {model: db.imagen,
          }

      ],
      where: { id: _id },
    })
    .then((registro) => {
      if (registro) {
        res.status(200).json({
          ok: true,
          msg: "Item encontrado",
          status: 200,
          data: registro,
        });
      } else {
        res.status(404).json({
          ok: false,
          msg: "Item no encontrado",
          status: 404,
          data: null,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al obtener el item",
        status: 500,
        data: error,
      });
    });
};

exports.crear = (req, res) => {
  const { nombre, descripcionBreve, precio_item, CategoriumId, disponible } = req.body;
console.log("body", req.body)
  menuItem
    .create({
      nombre: nombre,
      descripcionBreve: descripcionBreve,
      precio_item: precio_item,
      CategoriumId: CategoriumId,
      disponible: disponible,
      
      

    })
    .then((registro) => {
      res.status(201).json({
        ok: true,
        msg: "Item creado",
        status: 201,
        data: registro,
      });
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al crear el item",
        status: 500,
        data: error,
      });
    });
};

exports.actualizar = (req, res) => {
  const _id = req.params.id;
  const { nombre, descripcionBreve, precio_item, CategoriumId, disponible  } = req.body;
  menuItem
    .update(
      {
        nombre: nombre,
        descripcionBreve: descripcionBreve,
        precio_item: precio_item,
        CategoriumId: CategoriumId,
        disponible: disponible,
      
  

      },
      {
        where: { id: _id },
      }
    )
    .then((registro) => {
      res.status(200).json({
        ok: true,
        msg: "Item actualizado",
        status: 200,
        data: registro,
      });
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al actualizar el producto",
        status: 500,
        data: error,
      });
    });
};

exports.eliminar = (req, res) => {
  const _id = req.params.id;

  menuItem
    .destroy({
      where: { id: _id },
    })
    .then((registro) => {
      res.status(200).json({
        ok: true,
        msg: "Item eliminado",
        status: 200,
        data: registro,
      });
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al eliminar el producto",
        status: 500,
        data: error,
      });
    });
};

