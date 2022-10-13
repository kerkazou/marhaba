const userController = require('../controllers/userController.js');
const router = require('express').Router();

router.get('/', userController.getAllUsers);

module.exports = router;