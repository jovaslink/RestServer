const {response,request}=require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const authLogin = async (req = request, res = response)=>{
    const {correo,password} = req.body;
        
   try {

    //verificar que el correo exista
    const usuario = await Usuario.findOne({correo});
    if(!usuario){
        return res.status(400).json({
            msg:'Usuario o contraseña incorrectos -correo'
         });

    }
    // verificar que el usuario este activo
    if(!usuario.estado){
        return res.status(400).json({
            msg:'Usuario o contraseña incorrectos -estado'
         });

    }

    //verificar contraseña
    const passValido= bcryptjs.compareSync(password,usuario.password);

    if(!passValido){
        return res.status(400).json({
            msg:'Usuario o contraseña incorrectos -password'
        });
     }
    
    // asignar JWT
    const token = await generarJWT(usuario.id);

    

    res.json({
        usuario,
        token
        
     });

   } 
   
   catch(error) {
    console.log(error);
    res.status(500).json({
        msg:'Contacte con el administrador: jovaslink@gmail.com'
     });

   }
   
   
   
}

const googleSignin = async(req, res = response) => {

    const { id_token } = req.body;
    
    try {
        const { correo, nombre, img } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                role:'USER_ROLE',
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usuario en DB
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario,
            token
        });
        
    } catch (error) {

        res.status(400).json({
            msg: 'Token de Google no es válido',
            e: error
        })

    }



}

module.exports=
{
    authLogin,
    googleSignin
}