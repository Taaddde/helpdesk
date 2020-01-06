'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var logger = require('./services/logger')
var port = process.env.PORT || 3978;

mongoose.connect('mongodb://localhost:27017/helpdesk-test',{ useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false }, (err, res) =>{
    if(err){
        throw err;
    }else{
        console.log('Test esta corriendo correctamente');
        app.listen(port, function(){
            logger.info({message:{module:'test', msg:'Servidor iniciado en puerto '+port}});
        })
    }
})