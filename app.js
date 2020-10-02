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
var sector_routes = require('./routes/sector');
var chat_routes = require('./routes/chat');
var message_routes = require('./routes/message');
var work_routes = require('./routes/work');
var workobservation_routes = require('./routes/workobservation');
var deposit_routes = require('./routes/deposit/deposit');
var item_routes = require('./routes/deposit/item');
var stock_routes = require('./routes/deposit/stock');
var movim_routes = require('./routes/deposit/movim');
var reason_routes = require('./routes/deposit/reason');
var calendarEvent_routes = require('./routes/calendarEvent');
var todo_routes = require('./routes/todo');
var notification_routes = require('./routes/notification');

var order_routes = require('./routes/deposit/order');
var orderitem_routes = require('./routes/deposit/orderitem');

app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyparser.json({limit: '50mb', extended: true}));

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
app.use('/api/sector', sector_routes);
app.use('/api/chat', chat_routes);
app.use('/api/message', message_routes);
app.use('/api/work', work_routes);
app.use('/api/workobservation', workobservation_routes);
app.use('/api/deposit', deposit_routes);
app.use('/api/item', item_routes);
app.use('/api/stock', stock_routes);
app.use('/api/movim', movim_routes);
app.use('/api/reason', reason_routes);
app.use('/api/calendar-event', calendarEvent_routes);
app.use('/api/todo', todo_routes);
app.use('/api/notification', notification_routes);
app.use('/api/order', order_routes);
app.use('/api/orderitem', orderitem_routes);


app.get('*', function(req, res, next){
	res.sendFile(path.resolve('client/index.html'));
});

module.exports = app;