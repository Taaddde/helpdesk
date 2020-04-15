'use strict'

var express = require('express');
var controller = require('../controllers/chat');
var md_auth = require('../middlewares/autenticate');

var api = express.Router(); 

//CONSULTAS
api.get('/one/:id', md_auth.ensureAuth, controller.getOne);
api.get('/one/req/for-user/:id', md_auth.ensureAuth, controller.getReqForUser);
api.get('/one/for-user/:id', md_auth.ensureAuth, controller.getForUser);
api.get('/list/paged/:page/:perPage', md_auth.ensureAuth, controller.getPagedList);
api.get('/list/team/:id', md_auth.ensureAuth, controller.getTeamList);
api.get('/list/mychats/:id', md_auth.ensureAuth, controller.getMyChats);
api.get('/count/req/notifications/:id', md_auth.ensureAuth, controller.getReqNotification);
api.get('/count/notifications/:id', md_auth.ensureAuth, controller.getNotification);


//ABM
api.post('/add',md_auth.ensureAuth, controller.save);
api.put('/update/:id', md_auth.ensureAuth, controller.update);
api.delete('/delete/:id', md_auth.ensureAuth, controller.remove);

module.exports = api;