'use strict'

var mongoose = require('mongoose');
var moment = require('moment')
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var TagSchema = Schema({
    name: String,
    uses: {type: Number, default:0}    
});

module.exports = mongoose.model('Tag', TagSchema);