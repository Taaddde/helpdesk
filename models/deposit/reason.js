'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var Reason = Schema({
    name: String,
    type: String, //Transferencia, Entrada, Salida, Ajuste
    company: {type: Schema.ObjectId, ref:'Company'}, //QUIEN LO RECIBE
});

module.exports = mongoose.model('Reason', Reason);