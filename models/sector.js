'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Para crear documentos en la coleccion
var mongoosePaginate = require('mongoose-paginate-v2');


var SectorSchema = Schema({
    name: String,
    initials: String,
    email: String,
    deleted: {type: Boolean, default:false}
});

SectorSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Sector', SectorSchema);