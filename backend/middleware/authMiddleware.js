const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/usersModel');

// Valida el header Authorization: Bearer <token>
const protect = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401);
        throw new Error('No autorizado, no se envió token');
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        res.status(401);
        throw new Error('No autorizado, token inválido');
    }

    // El usuario sale del token, nunca del body ni de la URL
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
        res.status(401);
        throw new Error('No autorizado, el usuario no existe');
    }

    next();
});

module.exports = { protect };
