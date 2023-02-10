const {response,request}=require('express');
const Categoria = require('../models/categoria');


const categoriasById = async (req=request , res = response) => {
    const id = req.params.id;
    const categoria= await Categoria.findById(id);
        
    res.json({
        categoria
    });
}

const categoriasGet = async (req=request , res = response) => {
    
    const {limite = '5', desde='0'} = req.query;
    const query= {estado:true};

    /* const usuarios= await Usuario.find(query)
    .skip(Number(desde))
    .limit(Number(limite)); //se agrega Number para transformar el caracter en número
    
    const total = await Usuario.countDocuments(query);
 */
    //EJECUTA LAS 2 PROMESAS DE FORMA SIMULTANEA
    const [total, categorias] = await Promise.all([
        await Categoria.countDocuments(query),
        await Categoria.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);
    
    res.json({
        total,
        categorias
    });
}

const categoriasPost = async (req=request , res = response) => {

    const {descripcion} = req.body;
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({nombre});
    console.log(categoriaDB);
    if(categoriaDB) {
        return res.status(400).json({
               msg: `Ya existe una categoría con el nombre de ${categoriaDB.nombre}`
     });

    }

    const data = {
        nombre,
        descripcion,
        usuario: req.usuarioAuth._id
    }

    const categoria= new Categoria(data);
    //grabar en la base de datos
    await categoria.save();
   
    res.json({
        categoria        
    });
}

const categoriasPut = async (req=request , res = response) => {
    const id = req.params.id;
    const {...resto} = req.body;

    const categoria = await Categoria.findByIdAndUpdate(id, resto,{new: true});

    res.json({
        id,
        categoria,
    });
}


const categoriasDelete = async (req=request , res = response) => {
    const id = req.params.id;
    //const usuarioAuth = req.usuarioAuth;
    
    //Borrar el usuario fisicamente 
    // const categoria = await Categoria.findByIdAndDelete( idUser);
    
    const categoria = await Categoria.findByIdAndUpdate( id , {estado:false} ,{new: true});
    
    res.json({
        categoria
    }); 
   
}

module.exports={
    categoriasById,
    categoriasGet,
    categoriasPost,
    categoriasPut,
    categoriasDelete
}