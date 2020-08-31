'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var CalendarEventSchema = Schema({
    title: String,
    color: Schema.Types.Mixed,
    start: Date,
    end: Date,
    meta: Schema.Types.Mixed,
    type: String,
    user: {type: Schema.ObjectId, ref:'User'},
    team: {type: Schema.ObjectId, ref:'Team'},
});

module.exports = mongoose.model('CalendarEvent', CalendarEventSchema);