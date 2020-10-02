'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var Stock = Schema({
    deposit: {type: Schema.ObjectId, ref:'Deposit'},
    item: {type: Schema.ObjectId, ref:'Item'},

    cant: {type: Number, default: 0},
    cantMin: {type: Number, default: 0},

    onOrder: Boolean,
});

module.exports = mongoose.model('Stock', Stock);