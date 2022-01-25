const { validationResult } = require("express-validator");
const Proyecto = require("../models/Proyecto");
const Tarea = require("../models/Tarea");

exports.crearTarea = async (req, res) => {
    const errores = validationResult(req);
    !errores.isEmpty() && res.status(400).json({ errores: errores.array() });

    try {
        const { proyecto } = req.body;

        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            res.status(404).json({
                msg: 'proyecto no encontrado',
            });
        }
        if (existeProyecto?.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'No autorizado',

            });
        }

        const tarea = new Tarea(req.body);
        await tarea.save();
        res.status(200).json({ tarea });
    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error'
        })
    }
}

exports.obtenerTareas = async (req, res) => {

    try {
        const { proyecto } = req.query;
        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            res.status(404).json({
                msg: 'proyecto no encontrado',

            });
        }
        if (existeProyecto?.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'No autorizado',

            });
        }
        const tareas = await Tarea.find({ proyecto });
        res.json({ tareas })
    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error'
        })
    }
}


exports.actualizarTarea = async (req, res) => {

    try {
        const { proyecto, nombre, estado } = req.body;
        const existeProyecto = await Proyecto.findById(proyecto);
        let tareaExiste = await Tarea.findById(req.params.id);
        if (!tareaExiste) {
            res.status(404).json({
                msg: 'proyecto no encontrado',
                error
            });
        }
        if (existeProyecto?.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'No autorizado',

            });
        }
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;
        tareaExiste = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true });
        res.status(200).json({ tarea: tareaExiste })

    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error'
        })
    }
}

exports.eliminarTarea = async (req, res) => {
    try {
        const { proyecto } = req.query;
        const existeProyecto = await Proyecto.findById(proyecto);
        let tareaExiste = await Tarea.findById(req.params.id);
        if (!tareaExiste) {
            res.status(404).json({
                msg: 'proyecto no encontrado',
                error
            });
        }
        if (existeProyecto?.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'No autorizado',

            });
        }

        tareaExiste = await Tarea.findOneAndDelete({ _id: req.params.id });
        res.status(200).json({ msg: 'Tarea Eliminada' });

    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error'
        })
    }
}