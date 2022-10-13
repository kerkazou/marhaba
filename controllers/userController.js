const db = require('../models');

// Create Main Model
const User = db.user;
const Role = db.role;


// Get All Users
const getAllUsers = async(req , res) => {
  User.find()
  .then(e=>{
    res.json(e)
  })
  .catch(()=>{res.json({message: 'errror'})})
}


module.exports = {
  getAllUsers
}