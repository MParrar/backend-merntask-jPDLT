const Proyecto = require("../models/Proyecto");
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {

    const errores = validationResult(req);
    !errores.isEmpty() && res.status(400).json({ errores: errores.array() })
    try {
        const proyecto = new Proyecto(req.body);
        proyecto.creador = req.usuario.id;
        proyecto.save();
        res.status(200).json(proyecto);
    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error',
            error
        })
    }
}

exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id });
        res.status(200).json({ proyectos })
    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error',
            error
        })
    }
}

exports.actualizarProyectos = async (req, res) => {

    const errores = validationResult(req);
    !errores.isEmpty() && res.status(400).json({ errores: errores.array() });

    const { nombre } = req.body;
    const nuevoProyecto = {};

    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {

        let proyecto = await Proyecto.findById(req.params.id);
        if (!proyecto) {
            return res.status(404).json({
                msg: 'Proyecto no encontrado',
                error
            })
        }

        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'No autorizado',
                error
            })
        }
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id },
            { $set: nuevoProyecto }, { new: true });

        return res.status(200).json([proyecto])

    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error',
            error
        })
    }
}

exports.eliminarProyecto = async (req, res) => {

    try {
        let proyecto = await Proyecto.findById(req.params.id);
        if (!proyecto) {
            return res.status(404).json({
                msg: 'Proyecto no encontrado',
                error
            })
        }

        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'No autorizado',
                error
            })
        }

        await Proyecto.findOneAndRemove({ _id: req.params.id });
        res.status(200).json({ msg: 'Proyecto Eliminado' });
    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error',
            error
        })
    }
}