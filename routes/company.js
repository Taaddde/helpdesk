'use strict'

var express = require('express');
var companyController = require('../controllers/company');
var md_auth = require('../middlewares/autenticate');
var multipart = require('connect-multiparty'); //Para enviar ficheros
var md_upload = multipart({uploadDir: './uploads/companys'}); //Donde se van a subir los ficheros


var api = express.Router(); 

//CONSULTAS
api.get('/companies/', md_auth.ensureAuth, companyController.getCompanies);

//Imagenes
api.post('/image/:id',[md_auth.ensureAuth, md_upload], companyController.uploadImage);
api.get('/image/:imageFile', companyController.getImageFile);

//ABM
api.post('/add',md_auth.ensureAuth, companyController.saveCompany);
api.put('/update/:id', md_auth.ensureAuth, companyController.updateCompany);
api.delete('/delete/:id', md_auth.ensureAuth, companyController.deleteCompany);

module.exports = api;