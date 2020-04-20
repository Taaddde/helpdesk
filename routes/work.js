'use strict'

var express = require('express');
var controller = require('../controllers/work');
var md_auth = require('../middlewares/autenticate');

var api = express.Router(); 

//CONSULTAS
api.get('/one/:id', md_auth.ensureAuth, controller.getOne);
api.get('/list/:id', md_auth.ensureAuth, controller.getList);
api.get('/list-finish/:id', md_auth.ensureAuth, controller.getFinishList);

//ABM
api.post('/add',md_auth.ensureAuth, controller.save);
api.put('/update/:id', md_auth.ensureAuth, controller.update);
api.delete('/delete/:id', md_auth.ensureAuth, controller.remove);

module.exports = api;