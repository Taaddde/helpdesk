'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var Movim = Schema({
    numMovim: Number,
    type: String, //Transferencia, Entrada, Salida, Ajuste
    deposit: {type: Schema.ObjectId, ref:'Deposit'}, //DEPOSITO
    item: {type: Schema.ObjectId, ref:'Item'}, //ITEM

    cant: {type: Number, default: 1}, //CUANTO
    agent: {type: Schema.ObjectId, ref:'User'}, //QUIEN LO HACE
    reason: String, //POR QUE
    date: Date, 
    uploadDate: Date, 

    //Si es una salida, aclaro a quien va
    sector: {type: Schema.ObjectId, ref:'Sector'}, //DONDE
    requester: {type: Schema.ObjectId, ref:'User'}, //QUIEN LO RECIBE
    ticket: {type: Schema.ObjectId, ref:'Ticket'}, //TICKET

    //Si es transferencia, aclaro a que depósito va
    depositDestiny: {type: Schema.ObjectId, ref:'Deposit'}, //DEPOSITO DESTINO
});

module.exports = mongoose.model('Movim', Movim);