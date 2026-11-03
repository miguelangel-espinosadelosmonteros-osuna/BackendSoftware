const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const User = require('../models/usersModel');

const generarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// POST /api/users
const crearUser = asyncHandler(async (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        res.status(400);
        throw new Error('Faltan datos: nombre, email y password son obligatorios');
    }

    const userExiste = await User.findOne({ email });
    if (userExiste) {
        res.status(400);
        throw new Error('Ese email ya está registrado');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ nombre, email, password: passwordHash });

    res.status(201).json({
        _id: user.id,
        nombre: user.nombre,
        email: user.email,
    });
});

// POST /api/users/login
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            nombre: user.nombre,
            email: user.email,
            token: generarToken(user.id),
        });
    } else {
        res.status(401);
        throw new Error('Credenciales incorrectas');
    }
});

// GET /api/users/datos  (protegida)
const datosUser = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

module.exports = { crearUser, loginUser, datosUser };
