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
        type: String,
        required: [true, 'El precio es obligatorio']
    },
    
    estado: {
        type: Boolean,
        default: true
    },
    
    id_categoria: {
        type: String,
        required: [true, 'La categoría es obligatoria']
    },

    
});



module.exports = model( 'Productos', ProductoSchema );