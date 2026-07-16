const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/users/signup', userController.signup);
router.put('/users/:id', userController.createOrUpdate);
router.get('/users/by-email', userController.getByEmail);
router.get('/user/:id', userController.getById);

module.exports = router;
