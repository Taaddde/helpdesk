'use strict'

var express = require('express');
var controller = require('../controllers/todo');
var md_auth = require('../middlewares/autenticate');

var multipart = require('connect-multiparty'); //Para enviar ficheros
var md_upload = multipart({uploadDir: './uploads/todo'}); //Donde se van a subir los ficheros
var api = express.Router(); 

//CONSULTAS
api.get('/get/:id', md_auth.ensureAuth, controller.getOne);
api.get('/list', md_auth.ensureAuth, controller.getList);
api.get('/count', md_auth.ensureAuth, controller.getCount);

//ABM
api.post('/add',md_auth.ensureAuth, controller.save);
api.put('/update/:id', md_auth.ensureAuth, controller.update);
api.delete('/delete/:id', md_auth.ensureAuth, controller.remove);

//FILES
api.post('/file/:id',[md_auth.ensureAuth, md_upload], controller.uploadFile);
api.get('/file/:fileName', controller.getFile);

//AÑADIR UN TAG
api.put('/add-tag/:id', controller.addTag);
api.put('/remove-tag/:id', controller.removeTag);

//AÑADIR UN USUARIO
api.put('/add-user/:id', controller.addUser);
api.put('/remove-user/:id', controller.removeUser);


module.exports = api;