const db = require('../models');
const jwt = require('jsonwebtoken');
var storage = require('local-storage');
const mailer = require('../middleware/mailer');
const { user } = require('../models');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
require('../middleware/errorHandler');

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
        bcrypt.compare(body.password, user.password)
          .then(a=>{
            if(a){
              if(user.verification == false){
                res.json({message: 'Check your email to verify your acount'})
              }else{
                // Create token
                const token = jwt.sign({user}, process.env.TOKEN_KEY);
                storage('token', token);
                Role.findOne({_id: user.roles})
                  .then(nameRole=>{
                    res.redirect(`/api/user/${nameRole.name}/me`)
                  })
                  .catch(err=>{res.json({message: err })})
              }
            }else{
              res.json({message: 'Email or password invalid'});
            }
          })
          .catch(err=>{res.json({message: err })})
      }else{
        res.json({error:'Email or password invalid'});
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
        bcrypt.hash(body.password, saltRounds)
          .then(hash=>{
            User.create({...body, password: hash, roles: '634c709e68fda0b8cfaa9199', verification: false})
              .then(user=>{
                storage('email', body.email);
                mailer.main('activeemail')
                res.json({message: 'Your account added', user: user})
              })
          })
          .catch(()=>{res.json({message: 'errror'})})
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

// Verify forget password
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

// Change password
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

// Reset password
const resetPassword = async(req , res) => {
  const {body} = req;
  if(body.password == '' || (body.confirmepassword != body.password)){
    res.json({message: 'Fill the all files to chege your password'});
  }
  else{
    const token = storage('token')
    const user = jwt.verify(token, process.env.TOKEN_KEY)
    const email = user.user.email
    User.findOne({email: email})
      .then(user=>{
        if(user){
          User.updateOne({email: email}, {$set: {password: body.password}})
            .then(user=>{
              res.redirect('/home')
            })
            .catch(err=>{res.json({err: err})})
        }else{
          res.json({message: 'forgetpassword', error: 'user note found'})
        }
      })
  }
}

// Router message after login
const livreur = (req, res) => {
  const token = storage('token');
  if(token){
    const user = jwt.verify(token, process.env.TOKEN_KEY)
    Role.findOne({_id: user.user.roles})
    .then(nameRole=>{
      if(nameRole.name == 'livreur'){
        res.send('Bonjour '+user.user.first_name +' '+user.user.last_name+', votre rôle est :'+nameRole.name)
      }else{
        res.json({message: "You can't to access in this page." })
      }
    })
    .catch(err=>{res.json({message: err })})
  }
  else{
    res.json({message: 'You are logout' })
  }
}
const manager = (req, res) => {
  const token = storage('token');
  if(token){
    const user = jwt.verify(token, process.env.TOKEN_KEY)
    Role.findOne({_id: user.user.roles})
    .then(nameRole=>{
      if(nameRole.name == 'manager'){
        res.send('Bonjour '+user.user.first_name +' '+user.user.last_name+', votre rôle est :'+nameRole.name)
      }else{
        res.json({message: "You can't to access in this page." })
      }
    })
    .catch(err=>{res.json({message: err })})
  }
  else{
    res.json({message: 'You are logout' })
  }
}
const client = (req, res) => {
  const token = storage('token');
  if(token){
    const user = jwt.verify(token, process.env.TOKEN_KEY)
    Role.findOne({_id: user.user.roles})
    .then(nameRole=>{
      if(nameRole.name == 'client'){
        res.send('Bonjour '+user.user.first_name +' '+user.user.last_name+', votre rôle est :'+nameRole.name)
      }else{
        res.json({message: "You can't to access in this page." })
      }
    })
    .catch(err=>{res.json({message: err })})
  }
  else{
    res.json({message: 'You are logout' })
  }
}

// logout
const logout = (req,res) => {
  storage.clear();
    res.json({message: 'You are logout'})
}


module.exports = {
  login,
  register,
  activeEmail,
  forgetPassword,
  verifyForgetPassword,
  changePassword,
  resetPassword,
  livreur,
  manager,
  client,
  logout
}