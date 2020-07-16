'use strict'

var express = require('express');
var textblockController = require('../controllers/textblock');
var md_auth = require('../middlewares/autenticate');

var multipart = require('connect-multiparty'); //Para enviar ficheros
var md_upload = multipart({uploadDir: './uploads/attachs'}); //Donde se van a subir los ficheros
var md_upload_img = multipart({uploadDir: './uploads/images'}); //Donde se van a subir los ficheros


var api = express.Router(); 

//CONSULTAS
api.get('/textblock/:id', md_auth.ensureAuth, textblockController.getTextBlock);
api.get('/textblocks', md_auth.ensureAuth, textblockController.getTextBlocks);
api.get('/for-text/:text', md_auth.ensureAuth, textblockController.getTextBlockForText);
api.get('/for-ticket/:ticket/:type', md_auth.ensureAuth, textblockController.getTextBlockForTicket);

//Archivos
api.post('/file/:id',[md_auth.ensureAuth, md_upload], textblockController.uploadFile);
api.get('/file/:fileName', textblockController.getFile);
api.post('/image',[md_auth.ensureAuth, md_upload_img], textblockController.uploadImage);
api.get('/image/:fileName', textblockController.getImage);


//ABM
api.post('/add',md_auth.ensureAuth, textblockController.saveTextBlock);
api.put('/read-agent/:id', md_auth.ensureAuth, textblockController.readAgent);
api.put('/read-requester/:id', md_auth.ensureAuth, textblockController.readRequest);
api.put('/update/:id', md_auth.ensureAuth, textblockController.updateTextBlock);
api.delete('/delete/:id', md_auth.ensureAuth, textblockController.deletetextblock);
api.delete('/admin-delete/:id', md_auth.ensureAuth, textblockController.adminRemove);

module.exports = api;