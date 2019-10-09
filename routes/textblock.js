'use strict'

var express = require('express');
var textblockController = require('../controllers/TextBlock');
var md_auth = require('../middlewares/autenticate');

var api = express.Router(); 

//CONSULTAS
api.get('/textblock/:id', md_auth.ensureAuth, textblockController.getTextBlock);
api.get('/textblocks', md_auth.ensureAuth, textblockController.getTextBlocks);
api.get('/for-text/:text', md_auth.ensureAuth, textblockController.getTextBlockForText);
api.get('/for-ticket/:ticket', md_auth.ensureAuth, textblockController.getTextBlockForTicket);

//ABM
api.post('/add',md_auth.ensureAuth, textblockController.saveTextBlock);
api.put('/update/:id', md_auth.ensureAuth, textblockController.updateTextBlock);
api.delete('/delete/:id', md_auth.ensureAuth, textblockController.deletetextblock);

module.exports = api;