'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var NotificationSchema = Schema({
    message: String,
    icon: String,
    date: String,
    dateInit: String,
    route: String,
    color: String,
    user:{type: Schema.ObjectId,ref:'User'},
    event:{type: Schema.ObjectId,ref:'CalendarEvent'},
    todo:{type: Schema.ObjectId,ref:'Todo'},
});

    

module.exports = mongoose.model('Notification', NotificationSchema);