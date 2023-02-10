const {response,request}=require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');



const usuariosGet = async (req=request , res = response) => {
    
    const {limite = '5', desde='0'} = req.query;
    const query= {estado:true};

    /* const usuarios= await Usuario.find(query)
    .skip(Number(desde))
    .limit(Number(limite)); //se agrega Number para transformar el caracter en número
    
    const total = await Usuario.countDocuments(query);
 */
    //EJECUTA LAS 2 PROMESAS DE FORMA SIMULTANEA
    const [total, usuarios] = await Promise.all([
        await Usuario.countDocuments(query),
        await Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);
    
    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res) => {
    
    const {nombre,correo,role,password} = req.body;
    const usuario= new Usuario({nombre,correo,role,password});
    
    //encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password,salt);
    
    //grabar en la base de datos
    await usuario.save();
    res.json({
        msg:'post API',
        usuario
    });
}

const usuariosPut = async (req, res) => {
    const idUser = req.params.idUser;
    const {password,correo,google, ...resto} = req.body;

    if(password) {
        //encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password,salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(idUser , resto,{new: true});

    res.json({
        idUser,
        usuario,
    });
}


const usuariosDelete = async (req= request, res) => {
    const idUser = req.params.idUser;
    //const usuarioAuth = req.usuarioAuth;
    
    //Borrar el usuario fisicamente 
    // const usuario = await Usuario.findByIdAndDelete( idUser);
    
    const usuario = await Usuario.findByIdAndUpdate( idUser , {estado:false} ,{new: true});
    
    res.json({
        usuario
    });
}


module.exports= {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}