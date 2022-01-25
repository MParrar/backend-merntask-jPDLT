const express = require('express');
const { crearProyecto, obtenerProyectos, actualizarProyectos, eliminarProyecto } = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const router = express.Router();
const { check } = require('express-validator');

router.post('/',
    auth,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    ],
    crearProyecto);
router.get('/', auth, obtenerProyectos);

router.put('/:id',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    ], auth, actualizarProyectos);

router.delete('/:id', auth, eliminarProyecto)

module.exports = router;
