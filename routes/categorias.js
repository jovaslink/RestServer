const {Router} = require('express');
const { check } = require('express-validator');
const { categoriasById, categoriasGet, categoriasPost, categoriasPut, categoriasDelete } = require('../controllers/categorias');
const { existeIdCategoria } = require('../helpers/validacionesBD');
const {
    validarAdminRole,
    validarVariosRoles,
    validarJWT,
    validarCampos
} = require ('../middlewares'); //Se importan del index de middlewares con el operador rest o spreed



const router = Router();

    //Obtener todas las categorias - publico   
    router.get('/', categoriasGet);
    
    //Obtener categoria por id -publico
    router.get('/:id',
                    [ 
                        check('id', 'No es un Id válido').isMongoId(),
                        check('id').custom(existeIdCategoria), //Revisamos si existe el id en las categorias
                        validarCampos //funcion middleware que verifica si hay errores en los campos, si todo OK llama a next()
                    ],
                    categoriasById 
                );


    //Crear categoria - privado - cualquier persona con un token valido
    router.post('/', [
                        validarJWT, //validamos que envien un token valido
                        validarVariosRoles('USER_ROLE','ADMIN_ROLE'), //Protege la ruta con 1 o varios Roles que le asigemos desde la ruta
                        check('nombre','El nombre es obligatorio').not().isEmpty(),
                        check('descripcion','La descripción es obligatoria').not().isEmpty(),
                        validarCampos
                     ], 
                     categoriasPost );


    //Actualizar categoria - privado - cualquier persona con un token valido
    router.put('/:id',[
                        validarJWT, //validamos que envien un token valido
                        validarVariosRoles('USER_ROLE'), //Protege la ruta con 1 o varios Roles que le asigemos desde la ruta
                        check('id', 'No es un Id válido').isMongoId(),
                        check('id').custom(existeIdCategoria), //Revisamos si existe el id en las categorias
                        validarCampos //funcion middleware que verifica si hay errores en los campos, si todo OK llama a next()
                    ]
                    ,categoriasPut );


    //Borrar categoria -privado - admin    
    router.delete('/:id', 
                    [ 
                        validarJWT, //validamos que envien un token valido
                        validarAdminRole, //protege la ruta para que solo el ADMIN_ROLE pueda usarla
                        check('id', 'No es un Id válido').isMongoId(),
                        check('id').custom(existeIdCategoria), //Revisamos si existe el id en las categorias
                        validarCampos //funcion middleware que verifica si hay errores en los campos, si todo OK llama a next()
                    ], 
                    categoriasDelete );


module.exports= router;

