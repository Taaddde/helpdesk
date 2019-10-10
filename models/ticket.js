'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var TicketSchema = Schema({
    numTicket: Number,
    sub: String,
    requester: {type: Schema.ObjectId, ref:'User'},
    agent: {type: Schema.ObjectId, ref:'User'},
    status: {type: String, default:"Pendiente"},
    lastActivity: {type: String},
    createDate: {type: String},
    rating: {type: Number, default:0},
    source: {type: String, default:"NN"},
    tags: [
        {
            tag: {type: Schema.ObjectId, ref:'Tag'}
        }
    ]
});

module.exports = mongoose.model('Ticket', TicketSchema);