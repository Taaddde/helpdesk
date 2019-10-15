'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var UserSchema = Schema({
    name: String,
    surname: String,
    userName: String,
    password: String,
    email: String,
    role: {type: String, default:'ROLE_AGENT'},
    sign: {type: String, default:''},
    image:String,
});

module.exports = mongoose.model('User', UserSchema);