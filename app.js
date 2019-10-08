'use strict'

var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');

var app = express();

//cargar rutas
var user_routes = require('./routes/user');
var team_routes = require('./routes/team');
var response_routes = require('./routes/response');

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//configurar cabeceras http
/*
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, C-Requested-With, Content-Type, Accept, Access-Allow-Request-Method, Item, Deposit, Cant');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next(); 
});*/

//rutas base
//app.use('/', express.static('client', {redirect:false}));
app.use('/api/user', user_routes);
app.use('/api/team', team_routes);
app.use('/api/response', response_routes);

/*
app.get('*', function(req, res, next){
	res.sendFile(path.resolve('client/index.html'));
});*/

module.exports = app;