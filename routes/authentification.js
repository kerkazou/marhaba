const userController = require('../controllers/userController.js');

const mailer = require('../middleware/mailer');

const router = require('express').Router();

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/activeemail/:email', userController.activeEmail);
router.post('/forgetpassword', userController.forgetPassword);

router.get('/verifyforgetpassword/:email', userController.verifyForgetPassword);
router.post('/changepassword', userController.changePassword);

router.post('/resetpassword', userController.resetPassword);

module.exports = router;