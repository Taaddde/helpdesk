'use strict'

var express = require('express');
var responseController = require('../controllers/response');
var md_auth = require('../middlewares/autenticate');

var api = express.Router(); 

//CONSULTAS
api.get('/response/:id', md_auth.ensureAuth, responseController.getResponse);
api.get('/responses/:userId', md_auth.ensureAuth, responseController.getResponses);
api.get('/for-name/:name', md_auth.ensureAuth, responseController.getResponsesForName);

//ABM
api.post('/add',md_auth.ensureAuth, responseController.saveResponse);
api.put('/update/:id', md_auth.ensureAuth, responseController.updateResponse);
api.delete('/delete/:id', md_auth.ensureAuth, responseController.deleteResponse);

module.exports = api;