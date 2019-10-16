'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var TeamSchema = Schema({
    name: String,
    image: {type: String, default:'null'},
    users:{
        type: [Schema.ObjectId],
        ref:'User',
        default: undefined
    },
    default: {type: Boolean, default:false},
    createDate: {type: String, default:''},
});

module.exports = mongoose.model('Team', TeamSchema);