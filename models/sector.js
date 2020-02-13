'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var SectorSchema = Schema({
    name: String,
    email: String,
    deleted: {type: Boolean, default:false}
});

module.exports = mongoose.model('Sector', SectorSchema);