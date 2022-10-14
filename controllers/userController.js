const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var storage = require('local-storage');
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
    bcrypt.hash(body.password, saltRounds)
    .then(hash=>{
      User.findOne({email: email})
      .then(user=>{
        if(user){
          if(bcrypt.compare(body.password, user.password)){
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
        bcrypt.hash(body.password, saltRounds)
        .then(hash=>{
          body.password = hash;
          User.create({...body})
            .then(user=>{
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
            })
            .catch(()=>{res.json({message: 'errror'})})
        })
      }
    })
    .catch(()=>{res.json({message: 'errror'})})
  }
}

// Get All Users
const forgetPassword = async(req , res) => {
  const {body} = req;
  const email = body.email;
  User.findOne({email})
    .then(user=>{
      res.json({message: 'forgetPassword', user})
    })
    .catch(()=>{res.json({message: 'errror'})})
}

// Get All Users
const getAllUsers = async(req , res) => {
  User.find()
    .then(e=>{
      res.json(e)
    })
    .catch(()=>{res.json({message: 'errror'})})
}


module.exports = {
  login,
  register,
  forgetPassword,
  getAllUsers
}