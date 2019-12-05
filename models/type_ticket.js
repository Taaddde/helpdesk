'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var TypeTicketSchema = Schema({
    name: String,
    company: {type: Schema.ObjectId, ref:'Company',},
    deleted: {type: Boolean, default:false}
});

module.exports = mongoose.model('TypeTicket', TypeTicketSchema);