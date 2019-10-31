'use strict'

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var TicketSchema = Schema({
    numTicket: Number,
    sub: String,
    requester: {type: Schema.ObjectId, ref:'User'},
    agent: {type: Schema.ObjectId, ref:'User'},
    team: {type: Schema.ObjectId, ref:'Team'},
    status: {type: String, default:"Pendiente"},
    lastActivity: {type: String},
    createDate: {type: String},
    resolveDate: {type: String, default:"null"},
    rating: {type: Number, default:0},
    source: {type: String, default:"NN"},
    tags: [
        {
            tag: {type: Schema.ObjectId, ref:'Tag'}
        }
    ],
    priority: {type: String, default:"Normal"},
    company: {type: Schema.ObjectId, ref:'Company'}

});

TicketSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Ticket', TicketSchema);