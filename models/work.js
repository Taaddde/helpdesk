'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var WorkSchema = Schema({
    name: String,
    desc: String,

    //Quien creó la tarea
    createdBy: {type: Schema.ObjectId, ref:'User'},
    //Usuario responsable
    userWork: {type: Schema.ObjectId, ref:'User'},
    //Equipo responsable
    teamWork: {type: Schema.ObjectId, ref:'Team'},

    //Fecha de creación, fecha de cuando se realiza y fecha limite
    dateCreated: String,
    dateWork: String,
    dateLimit: String,

    //Etiqueta, para relacionar tareas
    tag: String,
    //Permite modificarse la tarea por el responsable
    editable: {type: String, default: false},
    //Estado (No comenzada - en curso - completada - a la espera de otra persona - aplazada)
    status:{type: String, default:'No comenzada'},
    priority:{type: String, default:'Normal'},
});

module.exports = mongoose.model('Work', WorkSchema);