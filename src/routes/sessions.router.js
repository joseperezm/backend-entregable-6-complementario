const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../dao/models/user-mongoose');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const user = new User({ first_name, last_name, email, age, password: password }); 
        await user.save();
        console.log('Registro exitoso para:', email); 
        res.redirect('/login');
    } catch (error) {
        console.log('Error al registrar el usuario:', error);
        res.status(500).send('Error al registrar el usuario');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            if (password === user.password) {
                req.session.user = user;
                console.log('Inicio de sesión exitoso para:', email);
                res.redirect('/products');
            } else {
                console.log('Intento de inicio de sesión fallido para:', email, '- Contraseña incorrecta');
                res.redirect('/login');
            }
        } else {
            console.log('Intento de inicio de sesión fallido - No se encontró el correo:', email);
            res.redirect('/login');
        }
    } catch (error) {
        console.log('Error al iniciar sesión:', error);
        res.status(500).send('Error al iniciar sesión');
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Error al cerrar sesión:', err);
            res.status(500).send('Error al cerrar sesión');
        } else {
            res.clearCookie('connect.sid', {path: '/'}); 
            res.redirect('/login'); 
        }
    });
});

module.exports = router;