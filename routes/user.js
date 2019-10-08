'use strict'

var express = require('express');
var userController = require('../controllers/user');
var md_auth = require('../middlewares/autenticate');
var multipart = require('connect-multiparty'); //Para enviar ficheros
var md_upload = multipart({uploadDir: './uploads/users'}); //Donde se van a subir los ficheros

var api = express.Router(); 
// segundo parametro = middleware
api.get('/user/:id', md_auth.ensureAuth, userController.getUser);
api.get('/users', md_auth.ensureAuth, userController.getUsers);

api.post('/add-team/:id', md_auth.ensureAuth, userController.addTeam);
api.post('/login', userController.loginUser);

api.post('/image/:id',[md_auth.ensureAuth, md_upload], userController.uploadImage);
api.get('/image/:imageFile', userController.getImageFile);
//Put para actualizar
//:id es obligatorio :id? es opcional
api.post('/add', userController.saveUser);
api.put('/update/:id', md_auth.ensureAuth, userController.updateUser);
api.delete('/delete/:id', md_auth.ensureAuth, userController.deleteUser);

module.exports = api;