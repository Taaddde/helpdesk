'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var TextBlockSchema = Schema({
    text: String,
    createDate: {type: Date, default:Date.now()},
    ticket: {type: Schema.ObjectId, ref:'ticket'},
});

module.exports = mongoose.model('TextBlock', TextBlockSchema);