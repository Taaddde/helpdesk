'use strict'

var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');

var app = express();

//cargar rutas
var user_routes = require('./routes/user');
var team_routes = require('./routes/team');
var response_routes = require('./routes/response');
var tag_routes = require('./routes/tag');
var company_routes = require('./routes/company');
var ticket_routes = require('./routes/ticket');
var textblock_routes = require('./routes/textblock');
var typeticket_routes = require('./routes/type_ticket');
var subtypeticket_routes = require('./routes/subtype_ticket');
var global_routes = require('./routes/global');


app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//configurar cabeceras http

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, C-Requested-With, Content-Type, Accept, Access-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next(); 
});

//rutas base
app.use('/', express.static('client', {redirect:false}));
app.use('/api/user', user_routes);
app.use('/api/team', team_routes);
app.use('/api/response', response_routes);
app.use('/api/tag', tag_routes);
app.use('/api/company', company_routes);
app.use('/api/ticket', ticket_routes);
app.use('/api/textblock', textblock_routes);
app.use('/api/type-ticket', typeticket_routes);
app.use('/api/subtype-ticket', subtypeticket_routes);
app.use('/api/global', global_routes);


app.get('*', function(req, res, next){
	res.sendFile(path.resolve('client/index.html'));
});

module.exports = app;