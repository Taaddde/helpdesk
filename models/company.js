'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var CompanySchema = Schema({
    name: String,
    email: String,
    image: {type: String, default:'null'},
    mailSender: {type: Boolean, default:false},
    password: String,
});

module.exports = mongoose.model('Company', CompanySchema);