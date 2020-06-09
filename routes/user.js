'use strict'

var express = require('express');
var userController = require('../controllers/user');
var md_auth = require('../middlewares/autenticate');
var multipart = require('connect-multiparty'); //Para enviar ficheros
var md_upload = multipart({uploadDir: './uploads/users'}); //Donde se van a subir los ficheros

var api = express.Router(); 

//CONSULTAS
api.get('/user/:id', md_auth.ensureAuth, userController.getUser);
api.get('/news/:id', md_auth.ensureAuth, userController.getNews);
api.get('/users/:company/:role?', md_auth.ensureAuth, userController.getUsers);
api.get('/for-name/:company/:name', md_auth.ensureAuth, userController.getUsersForName);
api.get('/req-for-name/:name', md_auth.ensureAuth, userController.getReqForName);
api.get('/valid-passtoken/:id/:passToken', userController.validUser);

//LOGIN
api.post('/login', userController.loginUser);
api.put('/forgot/:userName', userController.forgotPassword);

//Imagenes
api.post('/image/:id',[md_auth.ensureAuth, md_upload], userController.uploadImage);
api.get('/image/:imageFile', userController.getImageFile);

//ABM
api.post('/add', userController.saveUser);
api.put('/update/:id', md_auth.ensureAuth, userController.updateUser);
api.delete('/delete/:id', md_auth.ensureAuth, userController.deleteUser);
api.put('/unify/:userOrigin/:userDest', md_auth.ensureAuth, userController.unifyUser);

api.put('/reset-password/:id/:passToken', userController.resetPass);


module.exports = api;