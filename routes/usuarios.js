const {Router} = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete } = require('../controllers/usuarios');
const { existeRol, existeEmail, existeId } = require('../helpers/validacionesBD');

const {
        validarAdminRole,
        validarVariosRoles,
        validarJWT,
        validarCampos
    } = require ('../middlewares'); //Se importan del index de middlewares con el operador rest o spreed


const router = Router();
    //Los middlewares se ejecutan de forma secuencial
    router.get('/',
        [
            validarJWT,
            validarAdminRole //protege la ruta para que solo el ADMIN_ROLE pueda usarla
        ], 
        usuariosGet );
    
    router.post('/',
        [
            check('nombre','El nombre es obligatorio').not().isEmpty(),
            check('correo','El correo no es válido').isEmail(),
            check('password','El password tiene que tener más de 6 caracteres').isLength({min:6}),
            //check('role','No es un ROL váldo').isIn(['ADMIN_ROLE','USER_ROLE']),
            check('correo').custom(existeEmail),
            check('role').custom(existeRol), //la función recibe el campo role, pero al recibir y retornar el mismo campo se puede simplificar solo con el nombr de la función
            validarCampos //funcion middleware que verifica si hay errores en los campos, si todo OK llama a next()
        ],
        usuariosPost );
    
    router.put('/:idUser',
        [
            check('idUser', 'No es un Id válido').isMongoId(),
            check('idUser').custom(existeId),
            check('role').custom(existeRol), //la función recibe el campo role, pero al recibir y retornar el mismo campo se puede simplificar solo con el nombr de la función
            validarCampos
        ], 
        usuariosPut);
    
    router.delete('/:idUser',
        [ 
            validarJWT,
            //validarAdminRole,
            validarVariosRoles('EDITOR_ROLE','ADMIN_ROLE'),//Protege la ruta con 1 o varios Roles que le asigemos desde la ruta
            check('idUser', 'No es un Id válido').isMongoId(),
            check('idUser').custom(existeId),
            validarCampos
        ], 
        usuariosDelete);


module.exports= router;