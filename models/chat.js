'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion
var mongoosePaginate = require('mongoose-paginate-v2');

var ChatSchema = Schema({
    num: {type: Number, default:null},
    requester: {type: Schema.ObjectId, ref:'User'},
    agent: {type: Schema.ObjectId, ref:'User', default:undefined},
    date: {type: String, default:'null'},
    team: {type: Schema.ObjectId, ref:'Team'},
    company: {type: Schema.ObjectId, ref:'Company'},
    rating: {type: Number, default:null},
    finished: {type: Boolean, default:false}
});
ChatSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Chat', ChatSchema);