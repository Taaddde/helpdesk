'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var Order = Schema({
    numOrder: Number,

    date: Date,
    dateRequired: Date,
    uploadDate: Date,

    company: {type: Schema.ObjectId, ref:'Company'},
    sectorDestiny: String,

    justification: String,
    obs: String,

    status: String, //Pendiente, Finalizado
});

module.exports = mongoose.model('Order', Order);