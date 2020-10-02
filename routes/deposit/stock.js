'use strict'

var express = require('express');
var controller = require('../../controllers/deposit/stock');
var md_auth = require('../../middlewares/autenticate');

var api = express.Router(); 

//CONSULTAS
api.get('/get/:id', md_auth.ensureAuth, controller.getOne);
api.get('/list', md_auth.ensureAuth, controller.getList);

//ABM
api.post('/add',md_auth.ensureAuth, controller.save);
api.put('/update/:id', md_auth.ensureAuth, controller.update);
api.put('/update-many/:item', md_auth.ensureAuth, controller.updateMany);
api.delete('/delete/:id', md_auth.ensureAuth, controller.remove);
api.delete('/delete', md_auth.ensureAuth, controller.removeMany);

module.exports = api;