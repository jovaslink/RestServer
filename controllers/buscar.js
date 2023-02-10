const { response } = require("express");
const Categoria = require("../models/categoria");
const Producto = require("../models/producto");
const { ObjectId } = require("mongoose").Types;
const Usuario = require('../models/usuario');


const colecccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

/**
 * PARA BUSCAR TODOS LOS PRODUCTOS DE CIERTA CATEGORIA SE USA ESTE OBJETO O CONSULTA {categoria:ObjectId('id_categoria')}
 * SE PUEDE USAR PARA OTRAS COLECCIONES
 */

const buscarUsuarios = async ( termino, res )=>{

    const isMongo = ObjectId.isValid(termino);   
    if(isMongo){ 
        const usuario = await Usuario.findById(termino);
        return res.status(200).json({
            results:(usuario)? [usuario] : [] //enviamos un arreglo para tener las respuesta similiares para todas las busquedas
        })
    }
    const regexp = RegExp(termino, 'i'); //crea una expresion regular que hace flexible mayusculas y minusculas 
    
    const usuarios = await Usuario.find( //regresa un arreglo de usuarios o un arreglo vacio
                {
                   $or: [{nombre:regexp}, {correo:regexp}], //consulta OR
                   $and: [{estado:true}]  //consulta and
                });
    
    
    res.status(200).json({
        results: usuarios
    });
    
    
}

const buscarCategorias = async ( termino, res )=>{

    const isMongo = ObjectId.isValid(termino);   
    if(isMongo){ 
        const categoria = await Categoria.findById(termino);
        return res.status(200).json({
            results:(categoria)? [categoria] : [] //enviamos un arreglo para tener las respuesta similiares para todas las busquedas
        })
    }
    const regexp = RegExp(termino, 'i'); //crea una expresion regular que hace flexible mayusculas y minusculas 
    
    const categorias = await Categoria.find( //regresa un arreglo de usuarios o un arreglo vacio
                {
                   $or: [{nombre:regexp}, {descripcion:regexp}],  //consulta OR
                   $and: [{estado:true}]  //consulta and
                }).populate('usuario','nombre');
    
    
    res.status(200).json({
        results: categorias
    });
    
    
}

const buscarProductos = async ( termino, res )=>{

    const isMongo = ObjectId.isValid(termino);   
    if(isMongo){ 
        const producto = await Producto.findById(termino);
        return res.status(200).json({
            results:(producto)? [producto] : [] //enviamos un arreglo para tener las respuesta similiares para todas las busquedas
        })
    }
    const regexp = RegExp(termino, 'i'); //crea una expresion regular que hace flexible mayusculas y minusculas 
    
    const productos = await Producto.find( //regresa un arreglo de usuarios o un arreglo vacio , se puede usar count para que solo cuente
                {
                   $or: [   
                            {nombre:regexp}, 
                            {descripcion:regexp},
                            //{precio:regexp},
                            //{categoria:regexp},
                            //{usuario:regexp}
                        ],  //consulta OR
                   $and: [{estado:true}]  //consulta and
                }).populate('usuario','nombre')
                  .populate('categoria','nombre');
    
    
    res.status(200).json({
        results: productos
    });
    
    
}

const buscar=(req, res=response)=>{

    const {termino,coleccion}= req.params;

    const existeColeccion = colecccionesPermitidas.includes(coleccion);

    if(!existeColeccion){
        return res.status(400).json({
            msg: `Solo existen estas colecciones ${colecccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case "usuarios":
                        buscarUsuarios(termino,res);   
            break;
        case "categorias":
                        buscarCategorias(termino,res);
            
                break;
        case "productos":
                        buscarProductos(termino,res);
            break;
           
        default:
                res.status(500).json({
                    msg: "No está implementada esa búsqueda"
                });
            break;
    }

   

}

module.exports={
    buscar
}