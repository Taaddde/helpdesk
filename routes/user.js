'use strict'

var express = require('express');
var userController = require('../controllers/user');
var md_auth = require('../middlewares/autenticate');
var multipart = require('connect-multiparty'); //Para enviar ficheros
var md_upload = multipart({uploadDir: './uploads/users'}); //Donde se van a subir los ficheros

var api = express.Router(); 

//CONSULTAS
api.get('/user/:id', md_auth.ensureAuth, userController.getUser);
api.get('/users', md_auth.ensureAuth, userController.getUsers);

//AÑADIR UN TEAM
api.post('/add-team/:id', md_auth.ensureAuth, userController.addTeam);

//LOGIN
api.post('/login', userController.loginUser);

//Imagenes
api.post('/image/:id',[md_auth.ensureAuth, md_upload], userController.uploadImage);
api.get('/image/:imageFile', userController.getImageFile);

//ABM
api.post('/add', userController.saveUser);
api.put('/update/:id', md_auth.ensureAuth, userController.updateUser);
api.delete('/delete/:id', md_auth.ensureAuth, userController.deleteUser);

module.exports = api;