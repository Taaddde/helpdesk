'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var StockSchema = Schema({
    item: {type: Schema.ObjectId, ref:'Item'},
    deposit: {type: Schema.ObjectId, ref:'Deposit'},
    cantMin: {type: Number, default:0}
});

module.exports = mongoose.model('Stock', StockSchema);