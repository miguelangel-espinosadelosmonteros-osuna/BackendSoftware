const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Tarea = require('../models/tareasModel');

// Busca una tarea por id que además pertenezca al usuario del token
const buscarTareaDelUsuario = async (id, userId) => {
    if (!mongoose.isValidObjectId(id)) return null;
    return Tarea.findOne({ _id: id, user: userId });
};

// GET /api/tareas
const getTareas = asyncHandler(async (req, res) => {
    const tareas = await Tarea.find({ user: req.user.id });
    res.status(200).json(tareas);
});

// POST /api/tareas
const createTareas = asyncHandler(async (req, res) => {
    if (!req.body.descripcion) {
        res.status(400);
        throw new Error('Por favor teclea una descripción para la tarea');
    }

    const tarea = await Tarea.create({
        descripcion: req.body.descripcion,
        user: req.user.id,
    });

    res.status(201).json(tarea);
});

// PUT /api/tareas/:id
const updateTareas = asyncHandler(async (req, res) => {
    const tarea = await buscarTareaDelUsuario(req.params.id, req.user.id);

    if (!tarea) {
        res.status(404);
        throw new Error('Tarea no encontrada');
    }

    const tareaModificada = await Tarea.findByIdAndUpdate(
        tarea.id,
        { descripcion: req.body.descripcion },
        { new: true, runValidators: true }
    );

    res.status(200).json(tareaModificada);
});

// DELETE /api/tareas/:id
const deleteTareas = asyncHandler(async (req, res) => {
    const tarea = await buscarTareaDelUsuario(req.params.id, req.user.id);

    if (!tarea) {
        res.status(404);
        throw new Error('Tarea no encontrada');
    }

    await tarea.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = { getTareas, createTareas, updateTareas, deleteTareas };
