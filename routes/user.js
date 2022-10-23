const router = require('express').Router();
const userController = require('../controllers/userController.js');

router.get('/livreur/me', userController.livreur);
router.get('/manager/me', userController.manager);
router.get('/client/me', userController.client);

module.exports = router;