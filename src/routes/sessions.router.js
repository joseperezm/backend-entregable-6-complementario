const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../dao/models/user-mongoose');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const role = 'usuario'; 
        const user = new User({ 
            first_name, 
            last_name, 
            email, 
            age, 
            password: password, 
            role
        }); 
        await user.save();
        console.log('Registro exitoso para:', email, 'Rol:', role); 
        res.redirect('/login');
    } catch (error) {
        console.log('Error al registrar el usuario:', error);
        res.status(500).send('Error al registrar el usuario');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        req.session.user = {
            email,
            role: 'admin',
            first_name: 'Admin',
            last_name: 'CoderHouse',
            age: '9999'
        };
        console.log('Inicio de sesión exitoso para:', email, 'Rol: admin');
        return res.redirect('/products');
    }

    try {
        const user = await User.findOne({ email: email });
        if (user && password === user.password) {
            req.session.user = {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                role: 'usuario'
            };

            console.log('Inicio de sesión exitoso para:', email, 'Rol: usuario');
            res.redirect('/products');
        } else {
            console.log('Intento de inicio de sesión fallido para:', email, '- Contraseña incorrecta o usuario no encontrado');
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