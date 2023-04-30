const { response, request } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req = request, res = response) => {

    const { name, email, password } = req.body;

    try {

        // Verificar el email 
        // let user = await User.findOne({ email });
        const user = await User.findOne({ email: email });

        if( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email.'
            });
        }

        //Crear usuario con el modelo
        const dbUser = new User(req.body);

        // Cifrar el password
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync( password, salt );

        // Generar JWT
        const token = await generateJWT( dbUser.id, name, dbUser.email );

        // Crear usuario de DB
        await dbUser.save();

        // Generar respuesta exitosa
        return res.status(201).json({
            ok: true,
            uuid: dbUser.id,
            name,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

}

const loginUser = async (req = request, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar si el email existe
        const dbUser = await User.findOne({ email });

        if( !dbUser ){
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales invalidas.'
            });
        }

        // Confirmar si el password hace match
        const validPassword = bcrypt.compareSync( password, dbUser.password);

        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales invalidas.'
            });
        }

        //Generar JWT
        const token = await generateJWT( dbUser.id, dbUser.name, dbUser.email );

        // Respuesta del servicio
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            token
        });


    }catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }


}

const renewToken = async (req = request, res = response) => {

    const { uid, name, email } = req;

    //Generar JWT
    const token = await generateJWT(uid, name, email);

    return res.json({
        ok: true,
        uid,
        name,
        token,
        email
    });
}


module.exports = {
    createUser,
    loginUser,
    renewToken
}