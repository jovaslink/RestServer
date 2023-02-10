const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    
    descripcion: {
        type: String,
                
    },
    
    estado: {
        type: Boolean,
        default: true
    },

    usuario : {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    }
    
});

CategoriaSchema.methods.toJSON = function(){ 
    const {__v, estado, ...data } = this.toObject(); //quitamos la version y estado al devolver el modelo
    
    return data;
}


module.exports = model( 'Categoria', CategoriaSchema );