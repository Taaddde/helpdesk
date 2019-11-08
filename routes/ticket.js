'use strict'

var express = require('express');
var ticketController = require('../controllers/ticket');
var md_auth = require('../middlewares/autenticate');

var api = express.Router(); 

//CONSULTAS
api.get('/ticket/:id', md_auth.ensureAuth, ticketController.getTicket);
api.get('/tickets', md_auth.ensureAuth, ticketController.getTickets);
api.get('/for-number/:num', md_auth.ensureAuth, ticketController.getTicketsForNumber);
api.get('/ticketsPaged/:page&:perPage&:company&:status?&:userId?', md_auth.ensureAuth, ticketController.getTicketsPaged);
api.get('/reqTicketsPaged/:page&:perPage&:userId&:status?', md_auth.ensureAuth, ticketController.getReqTicketsPaged);
api.get('/for-user/:id', md_auth.ensureAuth, ticketController.getTicketsForUser);
api.get('/counts-agent/:company/:userId', md_auth.ensureAuth, ticketController.getCountTickets);
api.get('/counts-requester/:userId', md_auth.ensureAuth, ticketController.getCountReqTickets);
api.get('/unread/:userId', md_auth.ensureAuth, ticketController.getUnreadTickets);
api.get('/req-unread/:userId', md_auth.ensureAuth, ticketController.getUnreadTicketsReq);
api.get('/report/:company', md_auth.ensureAuth, ticketController.getTicketReports);

//ABM
api.post('/add',md_auth.ensureAuth, ticketController.saveTicket);
api.put('/update/:id', md_auth.ensureAuth, ticketController.updateTicket);
api.delete('/delete/:id', md_auth.ensureAuth, ticketController.deleteTicket);

module.exports = api;