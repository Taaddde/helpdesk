'use strict'

var express = require('express');
var controller = require('../../controllers/deposit/movim');
var md_auth = require('../../middlewares/autenticate');

var api = express.Router(); 

//CONSULTAS
api.get('/get/:id', md_auth.ensureAuth, controller.getOne);
api.get('/list', md_auth.ensureAuth, controller.getList);
api.get('/lastest-list/:limit', md_auth.ensureAuth, controller.getLastestList);

//ABM
api.post('/add',md_auth.ensureAuth, controller.save);
api.put('/update/:id', md_auth.ensureAuth, controller.update);
api.delete('/delete/:id', md_auth.ensureAuth, controller.remove);

module.exports = api;