const express = require("express");
const router = express.Router();
const { check } = require('express-validator');
const { autenticarUsuarios, usuarioAutenticado } = require("../controllers/authController");
const auth = require('../middleware/auth');

router.post('/',

    autenticarUsuarios
);

router.get('/',
    auth,
    usuarioAutenticado
)
module.exports = router;