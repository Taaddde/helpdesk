'use strict'

var express = require('express');
var teamController = require('../controllers/team');
var md_auth = require('../middlewares/autenticate');
var multipart = require('connect-multiparty'); //Para enviar ficheros
var md_upload = multipart({uploadDir: './uploads/teams'}); //Donde se van a subir los ficheros

var api = express.Router(); 

//CONSULTAS
api.get('/team/:id', md_auth.ensureAuth, teamController.getTeam);
api.get('/teams', md_auth.ensureAuth, teamController.getTeams);
api.get('/agents/:id', md_auth.ensureAuth, teamController.getAgentsInTeam);

//Imagenes
api.post('/image/:id',[md_auth.ensureAuth, md_upload], teamController.uploadImage);
api.get('/image/:imageFile', teamController.getImageFile);

//ABM
api.post('/add',md_auth.ensureAuth, teamController.saveTeam);
api.put('/update/:id', md_auth.ensureAuth, teamController.updateTeam);
api.delete('/delete/:id', md_auth.ensureAuth, teamController.deleteTeam);

//AÑADIR UN USUARIO
api.put('/add-user/:id', md_auth.ensureAuth, teamController.addUser);
api.put('/remove-user/:id', md_auth.ensureAuth, teamController.removeUser);


module.exports = api;