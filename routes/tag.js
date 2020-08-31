'use strict'

var express = require('express');
var tagController = require('../controllers/tag');
var md_auth = require('../middlewares/autenticate');

var api = express.Router(); 

//CONSULTAS
api.get('/tag/:id', md_auth.ensureAuth, tagController.getTag);
api.get('/list', md_auth.ensureAuth, tagController.getList);

//ABM
api.post('/add',md_auth.ensureAuth, tagController.saveTag);
api.put('/update/:id', md_auth.ensureAuth, tagController.updateTag);
api.delete('/delete/:id', md_auth.ensureAuth, tagController.deleteTag);

module.exports = api;