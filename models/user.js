'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var UserSchema = Schema({
    name: String,
    surname: String,
    userName: String,
    password: String,
    email: String,
    role: {type: String, default:'ROLE_USER'},
    sector: {type: String, default:'NN'},
    sectorRef: {type: Boolean, default:false},
    sign: {type: String, default:''},
    image:{type: String, default:'null'},
    company: {type: Schema.ObjectId, ref:'Company'},
    receiveMail: {type: Boolean, default:false},
    passToken: {type: String, default:null},
    passTokenExp: {type: String, default:'2000-01-01'},
    deleted: {type: Boolean, default:false}
});

module.exports = mongoose.model('User', UserSchema);