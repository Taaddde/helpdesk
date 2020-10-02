'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var Item = Schema({
    name: String,
    brand: String,
    company: {type: Schema.ObjectId, ref:'Company'},
});

module.exports = mongoose.model('Item', Item);