'use strict'

var express = require('express');
var controller = require('../controllers/chat');
var md_auth = require('../middlewares/autenticate');

var api = express.Router(); 

//CONSULTAS
api.get('/one/:id', md_auth.ensureAuth, controller.getOne);
api.get('/list/paged/:page/:perPage', md_auth.ensureAuth, controller.getPagedList);

//ABM
api.post('/add',md_auth.ensureAuth, controller.save);
api.put('/update/:id', md_auth.ensureAuth, controller.update);
api.delete('/delete/:id', md_auth.ensureAuth, controller.remove);

module.exports = api;