'use strict'

var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var TextBlockSchema = Schema({
    text: String,
    user: {type: Schema.ObjectId, ref:'User'},
    createDate: {type: String, default:''},
    ticket: {type: Schema.ObjectId, ref:'Ticket'},
    type: {type: String, default:'PUBLIC'}, //PRIVATE, PUBLIC, INFO, REQ
    files:{
        type: [String],
        default: undefined
    },
    read: {type: Boolean, default:'false'},
});

module.exports = mongoose.model('TextBlock', TextBlockSchema);