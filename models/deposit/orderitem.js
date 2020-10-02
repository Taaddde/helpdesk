'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var OrderItem = Schema({
    order: {type: Schema.ObjectId, ref:'Order'},

    item: {type: Schema.ObjectId, ref:'Item'},
    cant: Number,
    obs: String,
    code: String,
    costSector: String
});

module.exports = mongoose.model('OrderItem', OrderItem);