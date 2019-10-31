'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var SubTypeTicketSchema = Schema({
    name: String,
    typeTicket: {type: Schema.ObjectId, ref:'TypeTicket',},
    team: {type: Schema.ObjectId, ref:'Team',},
    resolveDate: {type: String, default:"null"},
    checks: {type: [], default:"null"},
    goodChecks: {type: Number, default:0},
    requireAttach: {type:Boolean, default:false}
});

module.exports = mongoose.model('SubTypeTicket', SubTypeTicketSchema);