'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var Deposit = Schema({
    name: String,
    company: {type: Schema.ObjectId, ref:'Company'},
});

module.exports = mongoose.model('Deposit', Deposit);