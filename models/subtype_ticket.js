'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var SubTypeTicketSchema = Schema({
    name: String,
    typeTicket: {type: Schema.ObjectId, ref:'TypeTicket',},
    team: {type: Schema.ObjectId, ref:'Team',},
    resolveDays: {type: Number, default:0},
    checks: {type: [], default:[]},
    goodChecks: {type: Number, default:0},
    requireAttach: {type:Boolean, default:false},
    desc: {type:String, default:'Por favor, describa los detalles de su solicitud, muchas gracias'},
    deleted: {type: Boolean, default:false},
    autoSub: {type: String, default:''},
    autoDesc: {type:String, default:''},
    autoChange: {type:Boolean, default:false},
    workTime: {type:Number, default:null}
});

module.exports = mongoose.model('SubTypeTicket', SubTypeTicketSchema);