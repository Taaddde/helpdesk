'use strict'

var express = require('express');
var controller = require('../controllers/sector');
var md_auth = require('../middlewares/autenticate');

var api = express.Router(); 

//CONSULTAS
api.get('/sector/:id', md_auth.ensureAuth, controller.getSector);
api.get('/sectors', md_auth.ensureAuth, controller.getSectors);
api.get('/for-name/:name', md_auth.ensureAuth, controller.getSectorsForName);
api.get('/sectorsPaged/:page/:perPage', md_auth.ensureAuth, controller.getListPaged);

//ABM
api.post('/add',md_auth.ensureAuth, controller.saveSector);
api.put('/update/:id', md_auth.ensureAuth, controller.updateSector);
api.delete('/delete/:id', md_auth.ensureAuth, controller.deleteSector);


module.exports = api;