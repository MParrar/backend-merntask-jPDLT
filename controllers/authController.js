const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


exports.autenticarUsuarios = async (req, res) => {
    const errores = validationResult(req);
    !errores.isEmpty() && res.status(400).json({ errores: errores.array() })


    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email });
        !usuario && res.status(400).json({ msg: 'El usuario no existe ' });

        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        !passCorrecto && res.status(400).json({ msg: 'password incorrecto' });

        const payload = {
            usuario: {
                id: usuario.id
            }
        };
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600
        }, (error, token) => {
            if (error) throw error;
            res.status(200).json({ token });

        });

    } catch (error) {
    }
}

exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.status(200).json({ usuario })
    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error'
        })
    }
}