const { response, request } = require("express");
const jwt = require('jsonwebtoken');

const validateJWT = ( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if( !token ){
        return res.status(401).json({
            ok: false,
            msg: 'Error en el token.'
        });
    }

    try {

        const { uid, name, email } = jwt.verify( token, process.env.SECRET_JWT_SEED );
        req.uid = uid;
        req.name = name;
        req.email = email;

    }catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido.'
        });
    }

    // TODO Ok!
    next();

}

module.exports = {
    validateJWT
}