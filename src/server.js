require('dotenv').config();
const { PORT, DATABASE_URL } = process.env;
const path = require('node:path');
const upload = require('multer')();
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
mongoose.connect(DATABASE_URL);

app.set('views', path.join(__dirname, '/app/views/pages'))
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: "yo", saveUninitialized: true, cookie: { maxAge: 1000 }, resave: false }));
app.use('/public', express.static(path.join(__dirname, 'app/public')));

app.get('/', (req, res) => {
    res.render('hi');
});

app.get('/login', (req, res) => {
    req.session.destroy();
    res.render('login');
});

app.get('/create-account', (req, res) => {
    res.render('create-account');
});

app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.render('dashboard');
    }
    else {
       res.redirect('/login');
    }
});

app.get('*', (req, res) => {
    res.status(404).render('404');
});

const AccountModel = require('./models/Account');
app.post('/create-account', upload.none(), async (req, res) => {
    const account = await AccountModel.create({ username: req.body['username'], password: req.body['password'] });
    await account.save();
    res.redirect('/login');
});

app.post('/login', upload.none(), async (req, res) => {
    const account = await AccountModel.findOne({ username: req.body['username'] });
    if (account) {
        if (account.password = req.body['password']) {
            req.session.user = account;
            res.redirect('/dashboard');
        }
        else {
            //password is incorrect
        }
    }
    else {
        //username is incorrect
    }
});

const port = PORT || 1337;
app.listen(port, () => { console.log(`Application running on port ${port}`); });