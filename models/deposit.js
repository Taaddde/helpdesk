'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var DepositSchema = Schema({
    name: String,
    desc: String,
    company: {type: Schema.ObjectId, ref:'Company'}
});

module.exports = mongoose.model('Deposit', DepositSchema);