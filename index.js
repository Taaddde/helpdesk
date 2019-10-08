'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.connect('mongodb://localhost:27017/helpdesk',{ useNewUrlParser: true, useFindAndModify: false }, (err, res) =>{
    if(err){
        throw err;
    }else{
        console.log('La base de datos esta corriendo bien');
        app.listen(port, function(){
            console.log('Servidor escuchando OK en localhost:'+port);
        })
    }
})