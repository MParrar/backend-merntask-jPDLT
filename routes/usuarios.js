const express = require("express");
const { crearUsuario } = require("../controllers/usuarioController");
const router = express.Router();
const { check } = require('express-validator');

router.post('/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email valido').isEmail(),
        check('password', 'El password debe ser minimo de 6 caracteres').isLength({ min: 6 }),
    ],

    crearUsuario);

module.exports = router;