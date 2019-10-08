'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var UserSchema = Schema({
    name: String,
    surname: String,
    userName: String,
    password: String,
    email: String,
    role: String,
    sign: String,
    teams: [
        {
            team: {type: Schema.ObjectId, ref:'Team'}
        }
    ],
    image:String,
});

module.exports = mongoose.model('User', UserSchema);