'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var logger = require('./services/logger')
var port = process.env.PORT || 3978;
var colors = require('colors');

mongoose.connect('mongodb://localhost:27017/helpdesk-test',{ useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false }, (err, res) =>{
    if(err){
        throw err;
    }else{
        console.log('Test esta corriendo correctamente');
        app.listen(port, function(){
            console.log(colors.cyan(' -----------------------------------------------------'))
            console.log(`${colors.cyan('|')}                   ${colors.bgGreen('API INICIADA')}                      ${colors.cyan('|')}`);
            console.log(`${colors.cyan('|')}   Aplicación: ${colors.green('Gestor de tickets HSJD')}                ${colors.cyan('|')}`);
            console.log(`${colors.cyan('|')}   Entorno: ${colors.green('TEST')}                                     ${colors.cyan('|')}`);
            console.log(`${colors.cyan('|')}   Puerto: ${colors.green(port)}                                      ${colors.cyan('|')}`);
            console.log(`${colors.cyan('|')}   DB: ${colors.green('localhost:27017/helpdesk-test')}                 ${colors.cyan('|')}`);
            console.log(colors.cyan(' -----------------------------------------------------'))
            logger.info({message:{module:'test', msg:'Servidor iniciado en puerto '+port}});
        })
    }
})