const userController = require('../controllers/userController.js');

const mailer = require('../middleware/mailer');

const router = require('express').Router();

router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/forgetpassword', userController.forgetPassword);
router.get('/activeemail/:email', userController.activeEmail);
router.get('/forgetpassword/:email', userController.verifyforgetPassword);
router.get('/formchangepassword', userController.formChangePassword);
router.get('/changepassword/:email', userController.changePassword);

module.exports = router;