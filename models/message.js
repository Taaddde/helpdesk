'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var MesaggeSchema = Schema({
    text: {type: String, default:''},
    readed: {type: Boolean, default:false},
    user: {type: Schema.ObjectId, ref:'User'},
    chat: {type: Schema.ObjectId, ref:'Chat'},
    date: {type: String, default:'null'},
});

module.exports = mongoose.model('Mesagge', MesaggeSchema);