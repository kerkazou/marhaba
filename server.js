const express = require("express");
const bodyparser = require("body-parser");
const app = express();

require('dotenv').config();

// MongoDB
require('./config/db');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

// Route
const verification  = require('./middleware/verification.js');
app.get('/home', verification.verification('home'),(req, res) => {
    res.render('home')
})
app.get('/login', (req, res) => {
    res.render('login')
})
app.get('/register', (req, res) => {
    res.render('register')
})
app.get('/forgetpassword', (req, res) => {
    res.render('forgetpassword')
})
app.get('/formchangepassword', (req, res) => {
    res.render('formchangepassword')
})
app.get('/resetpassword', verification.verification('resetpassword'), (req, res) => {
    res.render('resetpassword')
})
const authentification  = require('./routes/authentification.js');
app.use('/api/auth', authentification);
const user  = require('./routes/user.js');
app.use('/api/user', user);

// Port
const port = process.env.PORT || 3000;
app.listen(port, ()=> 
    console.log(`Server running on http://localhost:${port}`)
);