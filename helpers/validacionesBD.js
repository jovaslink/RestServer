const Categoria = require('../models/categoria');
const Role = require('../models/role');
const Usuario = require('../models/usuario');

const existeRol= async (role)=>{

    const existeRol= await Role.findOne({role});
    
    if (!existeRol){
        throw new Error(`El rol ${role} no está registrado en la BD`);
        
    }

}

//verificar que el correo no esté duplicado

const existeEmail= async (correo) => {
    
    const existeEmail= await Usuario.findOne({correo});
    
    if(existeEmail){
        throw new Error(`El correo ${correo} ya está registrado en la BD`);

    }
}

//verificar si el Id existe en la base de datos

const existeId= async (id) => {
    
    const existeId= await Usuario.findById(id);
    
    if(!existeId){
        throw new Error(`El Id ${id} no está registrado en la BD`);

    }
}

const existeIdCategoria= async (id) => {
    
    const existeId= await Categoria.findById(id);
    
    if(!existeId){
        throw new Error(`El Id ${id} no está registrado en la BD`);

    }
    if(!existeId.estado){
        throw new Error(`El Id ${id} no está registrado en la BD - estado`);
    }

}

const existeIdProducto= async (id) => {
    
    const existeId= await Categoria.findById(id);
    
    if(!existeId){
        throw new Error(`El Id ${id} no está registrado en la BD`);

    }
    if(!existeId.estado){
        throw new Error(`El Id ${id} no está registrado en la BD - estado`);
    }

}


module.exports={
    existeRol, existeEmail, existeId, existeIdCategoria, existeIdProducto
}