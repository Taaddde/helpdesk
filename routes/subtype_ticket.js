'use strict'

var express = require('express');
var subTypeTicketController = require('../controllers/subtype_ticket');
var md_auth = require('../middlewares/autenticate');

var api = express.Router(); 

//CONSULTAS
api.get('/subtype-ticket/:id', md_auth.ensureAuth, subTypeTicketController.getSubTypeTicket);
api.get('/subtype-tickets/:typeId', md_auth.ensureAuth, subTypeTicketController.getSubTypeTickets);
api.get('/for-name/:name/:typeId', md_auth.ensureAuth, subTypeTicketController.getSubTypeTicketsForName);

//ABM
api.post('/add',md_auth.ensureAuth, subTypeTicketController.saveSubTypeTicket);
api.put('/update/:id', md_auth.ensureAuth, subTypeTicketController.updateSubTypeTicket);
api.put('/goodcheck/:id', md_auth.ensureAuth, subTypeTicketController.addGoodCheck);
api.put('/add-check/:id', md_auth.ensureAuth, subTypeTicketController.addCheck);
api.delete('/delete/:id', md_auth.ensureAuth, subTypeTicketController.deleteSubTypeTicket);
api.put('/delete-check/:id', md_auth.ensureAuth, subTypeTicketController.deleteCheck);

module.exports = api;