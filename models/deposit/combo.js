'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var Combo = Schema({
    name: String,
    company: {type: Schema.ObjectId, ref:'Company'},
    items: {type: [Schema.Types.Mixed], default: new Array()}, 
});

module.exports = mongoose.model('Combo', Combo);