'use strict'

var express = require('express');
var typeTicketController = require('../controllers/type_ticket');
var md_auth = require('../middlewares/autenticate');

var api = express.Router(); 

//CONSULTAS
api.get('/type-ticket/:id', md_auth.ensureAuth, typeTicketController.getTypeTicket);
api.get('/type-tickets/:company', md_auth.ensureAuth, typeTicketController.getTypeTickets);
api.get('/for-name/:name/:company', md_auth.ensureAuth, typeTicketController.getTypeTicketsForName);

//ABM
api.post('/add',md_auth.ensureAuth, typeTicketController.saveTypeTicket);
api.put('/update/:id', md_auth.ensureAuth, typeTicketController.updateTypeTicket);
api.delete('/delete/:id', md_auth.ensureAuth, typeTicketController.deletetypeTicket);

module.exports = api;