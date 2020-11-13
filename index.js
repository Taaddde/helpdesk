'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var logger = require('./services/logger')
var port = process.env.PORT || 3977;
var colors = require('colors');

mongoose.connect('mongodb://localhost:27017/helpdesk',{ useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false }, (err, res) =>{
    if(err){
        throw err;
    }else{
        app.listen(port, function(){
            console.log(colors.cyan(' -----------------------------------------------------'))
            console.log(`${colors.cyan('|')}                   ${colors.bgGreen('API INICIADA')}                      ${colors.cyan('|')}`);
            console.log(`${colors.cyan('|')}   Aplicación: ${colors.green('Gestor de tickets HSJD')}                ${colors.cyan('|')}`);
            console.log(`${colors.cyan('|')}   Entorno: ${colors.green('PROD')}                                     ${colors.cyan('|')}`);
            console.log(`${colors.cyan('|')}   Puerto: ${colors.green(port)}                                      ${colors.cyan('|')}`);
            console.log(`${colors.cyan('|')}   DB: ${colors.green('localhost:27017/helpdesk')}                      ${colors.cyan('|')}`);
            console.log(colors.cyan(' -----------------------------------------------------'))
            logger.info({message:{module:'index', msg:'Servidor iniciado en puerto '+port}});
        })
    }
})