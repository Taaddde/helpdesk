'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var TeamSchema = Schema({
    name: String,
    surname: String,
    default: {type: Boolean, default:false},
});

module.exports = mongoose.model('Team', TeamSchema);