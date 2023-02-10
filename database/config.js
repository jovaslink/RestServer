const mongoose = require('mongoose');
mongoose.set("strictQuery", false);//en la nueva version se requiere para quitar warnings

const dbConnection= async ()=> {
        
    try {
        
        await mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useCreateIndex: true,
            //useFindAndModify: false //NO FUNCIONAN EN LAS NUEVAS VERSIONES, NO ACTUALIZABA EL OBJETO DEVUELTO
        });

        console.log('--BASE DE DATOS ONLINE--');

    } catch(error) {
        console.log(error);
        throw new Error('Error en la conexión a la base de datos');
    }

    
}

module.exports= {
    dbConnection
}

