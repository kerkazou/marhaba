const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB
mongoose.connect('mongodb://localhost/marhaba', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log('Successfully connect');
    })
    .catch(error=>{
        console.log('Connection error', error);
    })