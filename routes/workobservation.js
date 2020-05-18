'use strict'

var express = require('express');
var controller = require('../controllers/workobservation');
var md_auth = require('../middlewares/autenticate');

var multipart = require('connect-multiparty'); //Para enviar ficheros
var md_upload = multipart({uploadDir: './uploads/attachs'}); //Donde se van a subir los ficheros

var api = express.Router(); 

//CONSULTAS
api.get('/one/:id', md_auth.ensureAuth, controller.getOne);
api.get('/list/:id', md_auth.ensureAuth, controller.getListForId);

//Archivos
api.post('/file/:id',[md_auth.ensureAuth, md_upload], controller.uploadFile);
api.get('/file/:fileName', controller.getFile);

//ABM
api.post('/add',md_auth.ensureAuth, controller.save);
api.put('/read/:id', md_auth.ensureAuth, controller.read);
api.put('/update/:id', md_auth.ensureAuth, controller.update);
api.delete('/delete/:id', md_auth.ensureAuth, controller.remove);

module.exports = api;