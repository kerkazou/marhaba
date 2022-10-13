const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const mongoose = require('mongoose');
const dbConfig = require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

// MongoDB
mongoose.connect('mongodb://localhost/marhaba')
    .then(()=>{
        console.log('Connected');
    })
    .catch(error=>{
        console.log('Not Connected', error);
    })

// Route
app.get('/login', (req, res) => {
    res.render('login')
})
app.get('/register', (req, res) => {
    res.render('register')
})
app.get('/forgetpassword', (req, res) => {
    res.render('forgetpassword')
})
const authentification  = require('./routes/authentification.js');
app.use('/', authentification);

// Port
const port = process.env.PORT || 3000;
app.listen(port, ()=> 
    console.log(`Server running on http://localhost:${port}`)
);