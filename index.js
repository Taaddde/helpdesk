'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var logger = require('./services/logger')
var port = process.env.PORT || 3977;

mongoose.connect('mongodb://localhost:27017/helpdesk',{ useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false }, (err, res) =>{
    if(err){
        throw err;
    }else{
        console.log('La base de datos esta corriendo bien');
        app.listen(port, function(){
            logger.info({message:{module:'index', msg:'Servidor iniciado en puerto '+port}});
        })
    }
})