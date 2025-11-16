require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public'))); 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

const users = [
    { id: 'admin', email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASS, role: 'admin', userName: 'Admin Platforma' },
    { id: 'user', email: process.env.USER_EMAIL, password: process.env.USER_PASS, role: 'user', userName: 'Utilizator Standard' }
];

function findUser(email, password) {
    return users.find(u => u.email === email && u.password === password);
}

function isLoggedIn(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login.html'); 
}

function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.status(403).send('Access Denied: Nu ai permisiunea necesară.');
}

app.get('/auth/status', (req, res) => {
    if (req.session.user) {
        return res.json({
            isLoggedIn: true,
            userName: req.session.user.userName,
            userRole: req.session.user.role
        });
    }
    res.json({ isLoggedIn: false });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    const user = findUser(email, password);

    if (user) {
        req.session.user = {
            id: user.id,
            userName: user.userName, 
            role: user.role
        };
        
        res.json({ success: true, message: 'Login successful!' });
    } else {
        res.status(401).json({ success: false, message: 'Email sau parolă incorectă.' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Eroare la distrugerea sesiunii:', err);
            return res.status(500).json({ success: false, message: 'Eroare la deconectare.' });
        }
        res.json({ success: true, message: 'Deconectare reușită.' });
    });
});

app.get('/dashboard', isLoggedIn, (req, res) => {
    if (req.session.user.role === 'admin')
        res.sendFile(path.join(__dirname, 'protected_views/admin.html'));
    else
        res.sendFile(path.join(__dirname, '/public/dashboard.html'));
});

app.get('/aplication', isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, 'protected_views/aplication.html'));
});

app.get('/admin-dashboard', isLoggedIn, isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'protected_views/admin.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});