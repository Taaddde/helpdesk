'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var ItemSchema = Schema({
    name: String,
    brand: {type: String, default:'No especificado'},
    desc: {type: String, default:'Sin descripción'},
    date: String,
    deleted: {type: Boolean, default:false}
});

module.exports = mongoose.model('Item', ItemSchema);