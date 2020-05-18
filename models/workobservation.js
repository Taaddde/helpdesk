'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var WorkObservationSchema = Schema({
    work: {type: Schema.ObjectId, ref:'Work'},

    text: String,

    //Quien creó la tarea
    user: {type: Schema.ObjectId, ref:'User'},

    //Fecha de creación
    date: String,

    files:{
        type: [String],
        default: undefined
    },

    read: {type: Boolean, default:'false'},

});

module.exports = mongoose.model('WorkObservation', WorkObservationSchema);