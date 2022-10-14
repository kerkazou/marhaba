const userController = require('../controllers/userController.js');
const router = require('express').Router();

router.get('/', userController.getAllUsers);
router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/forgetpassword', userController.forgetPassword);

module.exports = router;