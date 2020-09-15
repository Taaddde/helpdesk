'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion

var TodoSchema = Schema({
    title: String,
    note: String,
    important: {type: Boolean, default: false},
    starred: {type: Boolean, default: false},
    done: {type: Boolean, default: false},
    read: {type: Boolean, default: false},
    selected: {type: Boolean, default: false},
    startDate: String,
    dueDate: String,
    
    tags:{
        type: [Schema.ObjectId],
        ref:'Tag',
        default: undefined
    },

    team:{type: Schema.ObjectId, ref:'Team'},

    users:{
        type: [Schema.ObjectId],
        ref:'User',
        default: undefined
    },

    usersWhoRead:{
        type: [Schema.ObjectId],
        ref:'User',
        default: new Array()
    },

    files:{
        type: [String],
        default: new Array()
    },
});

    

module.exports = mongoose.model('Todo', TodoSchema);