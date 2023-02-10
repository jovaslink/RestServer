const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    
    descripcion: {
        type: String,
                
    },
    
    precio: {
        type: Number,
        default: 0
    },
    
    estado: {
        type: Boolean,
        default: true
    },

    disponible: {
        type: Boolean,
        default: true
    },
    
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true,
    },

    usuario : {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    }

    
});

ProductoSchema.methods.toJSON = function(){ 
    const {__v, estado, ...data } = this.toObject(); //quitamos la version y estado al devolver el modelo
    
    return data;
}

module.exports = model( 'Productos', ProductoSchema );