const db = require('../models');
const jwt = require('jsonwebtoken');
var storage = require('local-storage');
const mailer = require('../middleware/mailer');
const bcrypt = require('bcrypt');
const { user } = require('../models');
const saltRounds = 10;

// Create Main Model
const User = db.user;
const Role = db.role;


// Login
const login = async(req , res) => {
  const {body} = req;
  const email = body.email;
  if ((body.email == '') || (body.password == '')) {
    res.json({message: 'Fill the email and password to login'});
  }else{
    User.findOne({email: email})
    .then(user=>{
      if(user){
        if(body.password == user.password){
          if(user.verification == false){
            res.json({message: 'Check your email to verify your acount'})
          }else{
            // Create token
            const token = jwt.sign({user}, process.env.TOKEN_KEY);
            storage('token', token);
            res.redirect('/home')
          }
        }else{
          res.json({message: 'Email or password invalid'});
        }
      }else{
        res.json({error:'Email or assword invalid'});
      }
    })
    .catch(()=>{res.json({message: 'errror'})})
  }
}


// Register
const register = async(req , res) => {
  const {body} = req;
  const email = body.email
  if ((body.first_name == '') || (body.last_name == '') || (body.email == '') || (body.password == '') || (body.password == '') || (body.password == body.cofirm_password)) {
    res.json({message: 'Fill the all files to register'});
  }else{
    User.findOne({email})
    .then(user=>{
      if(user){
        res.json({message: 'User is arrely exist'})
      }
      else{
        User.create({...body, roles: '634c709e68fda0b8cfaa9199', verification: false})
          .then(()=>{
            storage('email', body.email);
            mailer.main('activeemail')
            res.redirect('/login')
          })
          .catch(err=>{res.json({message: err })})
      }
    })
    .catch(()=>{res.json({message: 'errror'})})
  }
}

// Activation Email
const activeEmail = async(req , res) => {
  const activeemail = jwt.verify(req.params.email, process.env.TOKEN_KEY)
  req.user = activeemail
  User.updateOne({email: req.user.email}, {$set: {verification: true}})
  .then(user=>{
    res.redirect('/login')
  })
  .catch(err=>{res.json({err: err})})
}



// Forget Password
const forgetPassword = async(req , res) => {
  const {body} = req;
  const email = body.email;
  User.findOne({email})
    .then(user=>{
      if(user){
        storage('email', body.email);
        mailer.main('verifyforgetpassword')
        res.redirect('/forgetpassword')
      }else{
        res.json({message: 'forgetPassword', error: 'user note found'})
      }
    })
    .catch(()=>{res.json({message: 'errror'})})
}

const verifyForgetPassword = async(req , res) => {
  const activeemail = jwt.verify(req.params.email, process.env.TOKEN_KEY)
  req.user = activeemail
  User.findOne({email: req.user.email})
    .then(user=>{
      if(user){
        storage('email', user.email);
        res.redirect('/formchangepassword')
      }else{
        res.json({message: 'forgetpassword', error: 'user note found'})
      }
    })
    .catch(()=>{res.json({message: 'errror'})})
}

const changePassword = async(req , res) => {
  const {body} = req;
  if(body.password == '' || (body.password != body.condirmepassword)){
    res.json({message: 'Fill the all files to chege your password'});
  }
  else{
    const email = storage('email')
    User.findOne({email: email})
      .then(user=>{
        if(user){
          User.updateOne({email: email}, {$set: {password: body.password}})
            .then(user=>{
              res.redirect('/login')
            })
            .catch(err=>{res.json({err: err})})
        }else{
          res.json({message: 'forgetpassword', error: 'user note found'})
        }
      })
    }
}


module.exports = {
  login,
  register,
  activeEmail,
  forgetPassword,
  verifyForgetPassword,
  changePassword
}