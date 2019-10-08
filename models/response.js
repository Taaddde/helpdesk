'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var ResponseSchema = Schema({
    hashtag: String,
    resp: String,
});

module.exports = mongoose.model('Response', ResponseSchema);