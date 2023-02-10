const {Router} = require('express');
const { check } = require('express-validator');
const {  } = require('../controllers/categorias');
const { productosGet, productosById, productosPost, productosPut, productosDelete } = require('../controllers/productos');
const { existeIdProducto } = require('../helpers/validacionesBD');
const {
    validarAdminRole,
    validarVariosRoles,
    validarJWT,
    validarCampos
} = require ('../middlewares'); //Se importan del index de middlewares con el operador rest o spreed



const router = Router();

    //Obtener todas las categorias - publico   
    router.get('/', productosGet);
    
    //Obtener categoria por id -publico
    router.get('/:id',
                    [ 
                        check('id', 'No es un Id válido').isMongoId(),
                        check('id').custom(existeIdProducto), //Revisamos si existe el id en las categorias
                        validarCampos //funcion middleware que verifica si hay errores en los campos, si todo OK llama a next()
                    ],
                    productosById
                );


    //Crear categoria - privado - cualquier persona con un token valido
    router.post('/', [
                        validarJWT, //validamos que envien un token valido
                        validarVariosRoles('USER_ROLE'), //Protege la ruta con 1 o varios Roles que le asigemos desde la ruta
                        check('nombre','El nombre es obligatorio').not().isEmpty(),
                        check('descripcion','La descripción es obligatoria').not().isEmpty(),
                        check('precio','El precio es obligatorio').not().isEmpty(),
                        check('id_categoria','El id de la categoría es obligatoria').not().isEmpty(),
                        check('id_categoria', 'El id de la categoría no es un Id válido').isMongoId(),
                        validarCampos
                     ], 
                     productosPost );


    //Actualizar categoria - privado - cualquier persona con un token valido
    router.put('/:id',[
                        validarJWT, //validamos que envien un token valido
                        validarVariosRoles('USER_ROLE'), //Protege la ruta con 1 o varios Roles que le asigemos desde la ruta
                        check('id', 'No es un Id válido').isMongoId(),
                        check('id').custom(existeIdProducto), //Revisamos si existe el id en las categorias
                        validarCampos //funcion middleware que verifica si hay errores en los campos, si todo OK llama a next()
                    ]
                    ,productosPut );


    //Borrar categoria -privado - admin    
    router.delete('/:id', 
                    [ 
                        validarJWT, //validamos que envien un token valido
                        validarAdminRole, //protege la ruta para que solo el ADMIN_ROLE pueda usarla
                        check('id', 'No es un Id válido').isMongoId(),
                        check('id').custom(existeIdProducto), //Revisamos si existe el id en las categorias
                        validarCampos //funcion middleware que verifica si hay errores en los campos, si todo OK llama a next()
                    ], 
                    productosDelete );


module.exports= router;

