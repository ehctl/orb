const express = require('express')

const userController = require('../controller/user');

const router = express.Router();
const jwtToken = require('../middleware/jwt');

router.get('/login',userController.login );
router.get('/search', jwtToken.isAuth,  userController.search);

module.exports =  router;
