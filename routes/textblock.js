'use strict'

var express = require('express');
var textblockController = require('../controllers/TextBlock');
var md_auth = require('../middlewares/autenticate');

var multipart = require('connect-multiparty'); //Para enviar ficheros
var md_upload = multipart({uploadDir: './uploads/attachs'}); //Donde se van a subir los ficheros


var api = express.Router(); 

//CONSULTAS
api.get('/textblock/:id', md_auth.ensureAuth, textblockController.getTextBlock);
api.get('/textblocks', md_auth.ensureAuth, textblockController.getTextBlocks);
api.get('/for-text/:text', md_auth.ensureAuth, textblockController.getTextBlockForText);
api.get('/for-ticket/:ticket', md_auth.ensureAuth, textblockController.getTextBlockForTicket);

//Archivos
api.post('/file/:id',[md_auth.ensureAuth, md_upload], textblockController.uploadFile);
api.get('/file/:fileName', textblockController.getFile);

//ABM
api.post('/add',md_auth.ensureAuth, textblockController.saveTextBlock);
api.put('/read/:id', md_auth.ensureAuth, textblockController.readAll);
api.put('/update/:id', md_auth.ensureAuth, textblockController.updateTextBlock);
api.delete('/delete/:id', md_auth.ensureAuth, textblockController.deletetextblock);

module.exports = api;