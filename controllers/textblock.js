'use strict'
var TextBlock = require('../models/textblock');
var moment = require('moment');
//Sistema de ficheros
var fs = require('fs');
var path = require('path');

const mongoose =require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

//Sistema de log
var logger = require('../services/logger');


function getTextBlock(req, res){
    var functionName = 'getTextBlock';
    var populateQuery = [
        {path:'user', select:['name','surname','image']},
    ];

    var textblockId = req.params.id;

    TextBlock.findById(textblockId, (err, textblock) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!textblock){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Objeto no encontrado'}});
                res.status(404).send({message: 'El bloque de texto no existe'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Solicitud realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({textblock});
            }
        }
    }).populate(populateQuery);
}

function getTextBlocks(req, res){
    var functionName = 'getTextBlocks';
    TextBlock.find({}, (err, textblocks) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!textblocks){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Objeto no encontrado'}});
                res.status(404).send({message: 'El bloque de texto no existe'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Solicitud realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({textblocks});
            }
        }
    });
}

function saveTextBlock(req, res){
    var functionName = 'saveTextBlock';
    

    var textblock = new TextBlock();

    var params = req.body;

    textblock.text = params.text;
    textblock.user = params.user;
    textblock.ticket = params.ticket;
    textblock.type = params.type;
    textblock.read = textblock.read;
    textblock.createDate = moment().format("YYYY-MM-DD HH:mm");

    textblock.save((err, textblockStored) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'})
        }else{
            if(!textblockStored){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Objeto no encontrado'}});
                res.status(404).send({message: 'El bloque de texto no ha sido guardado'})
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Solicitud realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({textblock:textblockStored})
            }
        }
    });
}

function getTextBlockForText(req, res){
    var functionName = 'getTextBlockForText';
    var text = req.params.text;
    TextBlock.find({text: { "$regex": text, "$options": "i" }}).sort('createDate').exec(function(err, textblocks){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!textblocks){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Objeto no encontrado'}});
                res.status(404).send({message: 'No hay bloque de textos'})
            }else{
                          logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Solicitud realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({
                    textblocks: textblocks
                });
            }
        }
    });
}

function getTextBlockForTicket(req, res){
    var functionName = 'getTextBlockForTicket';
    var ticket = req.params.ticket;
    var type = req.params.type
    var query;

    if(type == 'ROLE_REQUESTER'){
        query = {ticket: ticket, type: { $ne: 'PRIVATE' }}
    }else{
        query = {ticket: ticket}
    }

    var populateQuery = [
        {path:'user', select:['name','surname','image', 'sign']},
    ];

    TextBlock.find(query).populate(populateQuery).sort('createDate').exec(function(err, textblocks){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!textblocks){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Objeto no encontrado'}});
                res.status(404).send({message: 'No hay bloque de textos'})
            }else{
                          logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Solicitud realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({
                    textblocks: textblocks
                });
            }
        }
    });
}

function updateTextBlock(req, res){
    var functionName = 'updateTextBlock';
    var textblockId = req.params.id;
    var update =  req.body;

    //textblockId = textblock buscado, update = datos nuevos a actualizar
    TextBlock.findByIdAndUpdate(textblockId, update, (err, textblockUpdated) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!textblockUpdated){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado El bloque de texto'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Solicitud realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({textblock:textblockUpdated});
            }
        }
    });
}

function readAgent(req, res){
    var functionName = 'readAgent';
    var ticketId = req.params.id;
    var update =  req.body;

    //textblockId = textblock buscado, update = datos nuevos a actualizar
    TextBlock.updateMany({ticket:ObjectId(ticketId), type:'REQUEST'}, update, (err, textblockUpdated) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!textblockUpdated){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado El bloque de texto'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Solicitud realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({textblock:textblockUpdated});
            }
        }
    });
}

function readRequest(req, res){
    var functionName = 'readRequest';
    var ticketId = req.params.id;
    var update =  req.body;

    //textblockId = textblock buscado, update = datos nuevos a actualizar
    TextBlock.updateMany({ticket:ObjectId(ticketId), type:'PUBLIC'}, update, (err, textblockUpdated) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!textblockUpdated){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado El bloque de texto'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Solicitud realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({textblock:textblockUpdated});
            }
        }
    });
}


function deletetextblock(req, res){
    var functionName = 'deletetextblock';
    var textblockId = req.params.id;

    TextBlock.findByIdAndDelete(textblockId, (err, textblockRemoved) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': '+err}});
                res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!textblockRemoved){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado El bloque de texto'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Solicitud realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({textblock: textblockRemoved});
            }
        }
    });
}

function uploadFile(req, res){
    var functionName = 'uploadFile';
    var tbId = req.params.id;
    var file_name = 'No subido';

    if(req.files){
        var file_path = req.files.file.path;
        var file_split = file_path.split('\\'); //eliminar y recortar las barras del path
        var file_name = file_split[2]; // [ 'uploads', 'users', 'pWgu0s-hHBgJl-5w1RSPS5G7.jpg' ]

        var ext_split = file_name.split('\.');
        var file_ext = ext_split [1]; //Comprueba si es un jpg [ 'j5HRZbfL7qgOgp2YRQ3F0ub8', 'jpg' ]
        if(true){

            TextBlock.findByIdAndUpdate(tbId, {$push: {files: file_name}}, (err, textblockUpdated) =>{
                if(err){
                    logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': '+err}});
                res.status(500).send({message: 'Error al actualizar el usuario'});
                }else{
                    if(!textblockUpdated){
                        logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                    }else{
                      logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Solicitud realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({order: textblockUpdated});
                    }
                }
            });
        }else{
                      logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Solicitud realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({message: 'Extension de archivo no valido'});
        }

        console.log(ext_split);
    }else{
        logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Solicitud de '+req.params.id}});
                res.status(200).send({message: 'No ha subido ninguna imagen'});
    }
}

function getFile(req, res){
    var functionName = 'getFile';
    var file = req.params.fileName;
    var pathFile = './uploads/attachs/'+file;

    fs.exists(pathFile, function(exists){
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
                      logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Solicitud realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({message: 'No existe el archivo...'});
        }
    });
}

module.exports = {
    getTextBlock,
    getTextBlockForText,
    getTextBlockForTicket,
    getTextBlocks,

    saveTextBlock,
    updateTextBlock,
    deletetextblock,
    readAgent,
    readRequest,

    uploadFile,
    getFile
};