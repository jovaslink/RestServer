const validarRoles  = require('../middlewares/validar-roles');
const validarJWT = require('../middlewares/validar-jwt');
const validarCampos = require('../middlewares/validarCampos'); 
//las constantes contienen las exportaciones de cada middleware 


module.exports={
    ...validarRoles,
    ...validarJWT,
    ...validarCampos
}
//con el operador ... mandamos todo el contenido de las constantes en este caso las exportaciones de los middlewares