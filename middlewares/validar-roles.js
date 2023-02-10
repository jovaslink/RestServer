const { response, request } = require("express")

const validarAdminRole= (req = request , res = response, next)=>{

    if(!req.usuarioAuth){

        return res.status(500).json({
            msg:'Hubo un problema al validar el Token'
        })
    }
    
    const {role,nombre} = req.usuarioAuth;
    
    if (role !== 'ADMIN_ROLE'){

        return res.status(401).json({
            msg: `El usuario ${nombre} no tiene permisos de Administrador`, 
        });
    }

    next();

}

const validarVariosRoles= (...roles)=>{

    return ( req=request, res =response, next)=>{

        if(!req.usuarioAuth){

            return res.status(500).json({
                msg:'Hubo un problema al validar el Token'
            })
        }

        if(!roles.includes(req.usuarioAuth.role)){

            return res.status(401).json({
                msg:`El usuario requiere alguno de estos roles: ${roles}`
            })
        }

        next();

    }

}

module.exports = {
        validarAdminRole,
        validarVariosRoles
    }