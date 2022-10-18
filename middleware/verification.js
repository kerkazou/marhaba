const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
var storage = require('local-storage');
const { render } = require("ejs");

function verification() {
  return (req,res,next)=>{
    if(storage('token')){
      const token = jwt.verify(storage('token'), process.env.TOKEN_KEY)
      if(token){
        res.render('home')
      }
    }
    else{
      res.redirect('login')
    }
  }
}

module.exports = {
  verification
}