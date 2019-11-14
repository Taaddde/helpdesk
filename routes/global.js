'use strict'

var express = require('express');
var globalController = require('../controllers/global');
var md_auth = require('../middlewares/autenticate');

var api = express.Router(); 

//CONSULTAS
api.get('/find-all/:name/:company', md_auth.ensureAuth, globalController.getCountSearch);

module.exports = api;