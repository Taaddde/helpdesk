'use strict'

var express = require('express');
var ticketController = require('../controllers/ticket');
var md_auth = require('../middlewares/autenticate');

var api = express.Router(); 

//CONSULTAS
api.get('/ticket/:id', md_auth.ensureAuth, ticketController.getTicket);
api.get('/tickets', md_auth.ensureAuth, ticketController.getTickets);
api.get('/for-number/:num', md_auth.ensureAuth, ticketController.getTicketsForNumber);
api.get('/for-name/:company/:sub', md_auth.ensureAuth, ticketController.getTicketsForName);
api.get('/ticketsPaged/:page&:perPage&:company&:status?&:userId?', md_auth.ensureAuth, ticketController.getTicketsPaged);
api.get('/reqTicketsPaged/:page&:perPage&:userId&:status?', md_auth.ensureAuth, ticketController.getReqTicketsPaged);
api.get('/for-user/:id', md_auth.ensureAuth, ticketController.getTicketsForUser);
api.get('/counts-agent/:company/:userId', md_auth.ensureAuth, ticketController.getCountTickets);
api.get('/counts-requester/:userId', md_auth.ensureAuth, ticketController.getCountReqTickets);
api.get('/unread/:userId', md_auth.ensureAuth, ticketController.getUnreadTickets);
api.get('/req-unread/:userId', md_auth.ensureAuth, ticketController.getUnreadTicketsReq);
api.get('/report/:company', md_auth.ensureAuth, ticketController.getTicketReports);
api.get('/calendar/:userId', md_auth.ensureAuth, ticketController.getDateTickets);
api.get('/teamPaged/:page/:perPage/:userId', md_auth.ensureAuth, ticketController.getTeamTickets);
api.get('/timework/report/:companyId', md_auth.ensureAuth, ticketController.getTimeWork);
api.get('/timework/for-subtype/:subTypeTicket/:workTime/:page?', md_auth.ensureAuth, ticketController.getTypeTimeWork);
api.get('/timework/phases/:subTypeTicket', md_auth.ensureAuth, ticketController.getTimeWorkPhases);

//ABM
api.post('/add',md_auth.ensureAuth, ticketController.saveTicket);
api.put('/update/:id', md_auth.ensureAuth, ticketController.updateTicket);
api.put('/checkclose', md_auth.ensureAuth, ticketController.checkClose);
api.delete('/delete/:id', md_auth.ensureAuth, ticketController.deleteTicket);

//AÑADIR UN CC
api.put('/addcc/:id', md_auth.ensureAuth, ticketController.addCc);
api.put('/removecc/:id', md_auth.ensureAuth, ticketController.removeCc);

module.exports = api;