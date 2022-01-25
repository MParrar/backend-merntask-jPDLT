const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    const errores = validationResult(req);
    !errores.isEmpty() && res.status(400).json({ errores: errores.array() })

    const { email, password } = req.body;

    try {
        let usuario;
        usuario = await Usuario.findOne({ email });
        if (usuario) {
            res.status(400).json({ msg: 'Ya existe un usuario con este correo' });
        }

        usuario = new Usuario(req.body);
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);
        usuario.registro = Date.now();
        await usuario.save();

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