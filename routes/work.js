'use strict'

var express = require('express');
var controller = require('../controllers/work');
var md_auth = require('../middlewares/autenticate');

var multipart = require('connect-multiparty'); //Para enviar ficheros
var md_upload = multipart({uploadDir: './uploads/attachs'}); //Donde se van a subir los ficheros

var api = express.Router(); 

//CONSULTAS
api.get('/one/:id', md_auth.ensureAuth, controller.getOne);
api.get('/list/:id', md_auth.ensureAuth, controller.getList);
api.get('/list-finish/:id', md_auth.ensureAuth, controller.getFinishList);
api.get('/list-free/:id', md_auth.ensureAuth, controller.getFreeList);
api.get('/calendar/:id', md_auth.ensureAuth, controller.getDateWork);
api.get('/free-count/:id', md_auth.ensureAuth, controller.getCountFreeWorks);
api.get('/count/:id', md_auth.ensureAuth, controller.getCountWorks);
api.get('/similar-count/:tag/:name/:desc', md_auth.ensureAuth, controller.getCountSimilars);
api.get('/listPaged/:page/:perPage/:userId/*', md_auth.ensureAuth, controller.getListPaged);

//Archivos
api.post('/file/:id',[md_auth.ensureAuth, md_upload], controller.uploadFile);
api.get('/file/:fileName', controller.getFile);

//ABM
api.post('/add',md_auth.ensureAuth, controller.save);
api.put('/update/:id', md_auth.ensureAuth, controller.update);
api.delete('/delete/:id', md_auth.ensureAuth, controller.remove);
api.delete('/deleteMany/:tag/:name/:desc', md_auth.ensureAuth, controller.removeMany);

module.exports = api;