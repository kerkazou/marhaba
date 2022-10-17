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
          // Create token
          const token = jwt.sign({
            user_id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
            roles: user.roles
          }, process.env.TOKEN_KEY);
          storage('token', token);
          res.json(user);
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
          .then(user=>{
            storage('email', body.email);
            mailer.main()
            res.json(user);
          })
          .catch(()=>{res.json({message: 'errror'})})
      }
    })
    .catch(()=>{res.json({message: 'errror'})})
  }
}

// Forget Password
const forgetPassword = async(req , res) => {
  const {body} = req;
  const email = body.email;
  User.findOne({email})
    .then(user=>{
      if(user){
        const x = storage('token');
        res.json({message: 'forgetPassword', user, x})
      }else{
        res.json({message: 'forgetPassword', error: 'user note found'})
      }
    })
    .catch(()=>{res.json({message: 'errror'})})
}

// Activation Email
const activeEmail = async(req , res) => {
  const activeemail = req.params
  User.findOneAndUpdate({email: activeemail}, {verification: true})
  .then(user=>{
    res.json({user})
  })
  .catch(err=>{res.json({err: err})})
}


module.exports = {
  login,
  register,
  forgetPassword,
  activeEmail
}