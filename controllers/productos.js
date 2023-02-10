const {response,request}=require('express');
const Producto = require('../models/producto');


const productosById = async (req=request , res = response) => {
    const id = req.params.id;
    const producto= await Producto.findById(id)
                        .populate('usuario','nombre')
                        .populate('categoria','nombre');;
        
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
        .populate('usuario','nombre')
        .populate('categoria','nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);
    
    res.json({
        total,
        productos
    });
}

const productosPost = async (req=request , res = response) => {

    const {...resto} = req.body;
    const data = {
        usuario: req.usuarioAuth._id,
        ...resto, // abre el objeto
    }

    //console.log(data)
    
    
    const producto= new Producto(data);
    
    //grabar en la base de datos
    await producto.save();
    
    res.json({
        producto
    });
}

const productosPut = async (req=request , res = response) => {
    const id = req.params.id;
    const {estado,usuario, ...resto} = req.body;
    
    const data = {
        usuario: req.usuarioAuth._id,
        ...resto //abre el objeto
    }
    
    
    const producto = await Producto.findByIdAndUpdate(id , data ,{new: true})
                    .populate('usuario','nombre')
                    .populate('categoria','nombre');

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