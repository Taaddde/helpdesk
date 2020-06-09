'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var UserSchema = Schema({
    num: Number,
    name: String,
    surname: String,
    dni: Number,
    userName: String,
    password: String,
    email: String,
    role: {type: String, default:'ROLE_USER'},
    sector: {type: Schema.ObjectId, ref:'Sector'},
    sectorRef: {type: Boolean, default:false},
    sign: {type: String, default:''},
    image:{type: String, default:'null'},
    company: {type: Schema.ObjectId, ref:'Company'},
    receiveMail: {type: Boolean, default:false},
    passToken: {type: String, default:null},
    passTokenExp: {type: String, default:'2000-01-01'},
    news: {type: Boolean, default:true},
    deleted: {type: Boolean, default:false},
    infoView: {type: Boolean, default:false},
    approved: {type: Boolean, default:true},
});

module.exports = mongoose.model('User', UserSchema);