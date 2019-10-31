'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var TypeTicketSchema = Schema({
    name: String,
    company: {type: Schema.ObjectId, ref:'Company',},
});

module.exports = mongoose.model('TypeTicket', TypeTicketSchema);