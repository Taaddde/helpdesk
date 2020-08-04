'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var MovimSchema = Schema({
    numMovim: Number,
    type: String,
    reason: String,
    stockA: {type: Schema.ObjectId, ref:'Stock'},
    stockB: {type: Schema.ObjectId, ref:'Stock'}, //Si es transferencia
    cant: Number,
    date: String,
    ticket: {type: Schema.ObjectId, ref:'Ticket'},
    userRes: {type: Schema.ObjectId, ref:'User'},
    userReq: {type: Schema.ObjectId, ref:'User'}, //Si es salida
});

module.exports = mongoose.model('Movim', MovimSchema);