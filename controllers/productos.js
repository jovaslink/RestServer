const {response,request}=require('express');
const Producto = require('../models/producto');


const productosById = async (req=request , res = response) => {
    const id = req.params.id;
    const producto= await Producto.findById(id);
        
    res.json({
        producto
    });
}

const productosGet = async (req=request , res = response) => {
    
    const {limite = '5', desde='0'} = req.query;
    const query= {estado:true};

    /* const usuarios= await Usuario.find(query)
    .skip(Number(desde))
    .limit(Number(limite)); //se agrega Number para transformar el caracter en número
    
    const total = await Usuario.countDocuments(query);
 */
    //EJECUTA LAS 2 PROMESAS DE FORMA SIMULTANEA
    const [total, productos] = await Promise.all([
        await Producto.countDocuments(query),
        await Producto.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);
    
    res.json({
        total,
        productos
    });
}

const productosPost = async (req=request , res = response) => {

    const {nombre,descripcion,precio,id_categoria} = req.body;
    const producto= new Productos({nombre,descripcion,precio,id_categoria});
    
    //grabar en la base de datos
    await producto.save();
    
    res.json({
        producto
    });
}

const productosPut = async (req=request , res = response) => {
    const id = req.params.id;
    const {...resto} = req.body;

    const producto = await Producto.findByIdAndUpdate(id , resto,{new: true});

    res.json({
        id,
        producto,
    });
}


const productosDelete = async (req=request , res = response) => {
    const id = req.params.id;
    //const usuarioAuth = req.usuarioAuth;
    
    //Borrar el usuario fisicamente 
    // const categoria = await Categoria.findByIdAndDelete( idUser);
    
    const producto = await Producto.findByIdAndUpdate( id , {estado:false} ,{new: true});
    
    res.json({
        producto
    }); 
   
}

module.exports={
    productosById,
    productosGet,
    productosPost,
    productosPut,
    productosDelete
}