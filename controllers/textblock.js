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
var jwt_decode = require('jwt-decode');

function getTextBlock(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getTextBlock';
    var populateQuery = [
        {path:'user', select:['name','surname','image']},
    ];

    var textblockId = req.params.id;

    TextBlock.findById(textblockId, (err, textblock) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!textblock){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'El bloque de texto no existe'});
            }else{
                res.status(200).send({textblock});
            }
        }
    }).populate(populateQuery);
}

function getTextBlocks(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getTextBlocks';
    TextBlock.find({}, (err, textblocks) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!textblocks){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'El bloque de texto no existe'});
            }else{
                res.status(200).send({textblocks});
            }
        }
    });
}

function saveTextBlock(req, res){
var decoded = jwt_decode(req.headers.authorization);
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
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'})
        }else{
            if(!textblockStored){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'El bloque de texto no ha sido guardado'})
            }else{
              //logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({textblock:textblockStored})
            }
        }
    });
}

function getTextBlockForText(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getTextBlockForText';
    var text = req.params.text;
    TextBlock.find({text: { "$regex": text, "$options": "i" }}).sort('createDate').exec(function(err, textblocks){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!textblocks){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay bloque de textos'})
            }else{
                res.status(200).send({
                    textblocks: textblocks
                });
            }
        }
    });
}

function getTextBlockForTicket(req, res){
    var decoded = jwt_decode(req.headers.authorization);
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
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!textblocks){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay bloque de textos'})
            }else{
                res.status(200).send({
                    textblocks: textblocks
                });
            }
        }
    });
}

function updateTextBlock(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'updateTextBlock';
    var textblockId = req.params.id;
    var update =  req.body;

    //textblockId = textblock buscado, update = datos nuevos a actualizar
    TextBlock.findByIdAndUpdate(textblockId, update, (err, textblockUpdated) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!textblockUpdated){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado El bloque de texto'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({textblock:textblockUpdated});
            }
        }
    });
}

function readAgent(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'readAgent';
    var ticketId = req.params.id;
    var update =  req.body;

    //textblockId = textblock buscado, update = datos nuevos a actualizar
    TextBlock.updateMany({ticket:ObjectId(ticketId), type:'REQUEST'}, update, (err, textblockUpdated) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!textblockUpdated){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado El bloque de texto'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({textblock:textblockUpdated});
            }
        }
    });
}

function readRequest(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'readRequest';
    var ticketId = req.params.id;
    var update =  req.body;

    //textblockId = textblock buscado, update = datos nuevos a actualizar
    TextBlock.updateMany({ticket:ObjectId(ticketId), type:'PUBLIC'}, update, (err, textblockUpdated) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!textblockUpdated){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado El bloque de texto'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({textblock:textblockUpdated});
            }
        }
    });
}


function deletetextblock(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'deletetextblock';
    var textblockId = req.params.id;
    let update = {text:'Este mensaje fue eliminado por el usuario.', files:undefined}
    TextBlock.findByIdAndUpdate(textblockId, update, (err, textblockRemoved) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!textblockRemoved){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado El bloque de texto'});
            }else{
                logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({textblock: textblockRemoved});

                if(textblockRemoved.files){
                    textblockRemoved.files.forEach(e => {
                        fs.unlink('../helpdesk/uploads/attachs/'+e, function (err) {
                            if (err) console.log(err);
                        });     
                    });    
                }
            }
        }
    });
}

function uploadFiles(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'uploadFile';
    var tbId = req.params.id;
    var file_name = 'No subido';
    if(req.files){
            var file_path = req.files.file.path;
            var file_split = file_path.split('\\'); //eliminar y recortar las barras del path
            var file_name = file_split[2]; // [ 'uploads', 'users', 'pWgu0s-hHBgJl-5w1RSPS5G7.jpg' ]
    
            var ext_split = file_name.split('\.');
            var file_ext = ext_split [1]; //Comprueba si es un jpg [ 'j5HRZbfL7qgOgp2YRQ3F0ub8', 'jpg' ]
    
            TextBlock.findByIdAndUpdate(tbId, {$push: {files: file_name}}, (err, textblockUpdated) =>{
                if(err){
                    logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                    res.status(500).send({message: 'Error al actualizar el usuario'});
                }else{
                    if(!textblockUpdated){
                        logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                    }else{
                        logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                        res.status(200).send({order: textblockUpdated});
                    }
                }
            });
    
            console.log(ext_split);
    
    }else{
        logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Solicitud de '+req.params.id}});
                res.status(200).send({message: 'No ha subido ninguna imagen'});
    }
}

async function uploadFile(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'uploadFile';
    var tbId = req.params.id;
    var file_name = 'No subido';

    if(req.files){
        if(req.files.file.length > 1){
            req.files.file.forEach(async e => {
                var file_path = e.path;
                var file_split = file_path.split('\\'); //eliminar y recortar las barras del path
                var file_name = file_split[2]; // [ 'uploads', 'users', 'pWgu0s-hHBgJl-5w1RSPS5G7.jpg' ]
        
                var ext_split = file_name.split('\.');
                var file_ext = ext_split [1]; //Comprueba si es un jpg [ 'j5HRZbfL7qgOgp2YRQ3F0ub8', 'jpg' ]
        
                TextBlock.findByIdAndUpdate(tbId, {$push: {files: file_name}}, (err, textblockUpdated) =>{
                    if(err){
                        logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                        res.status(500).send({message: 'Error al actualizar el usuario'});
                    }else{
                        if(!textblockUpdated){
                            logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                            res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                        }
                    }
                });
            });    
        }else{
            var file_path = req.files.file.path;
            var file_split = file_path.split('\\'); //eliminar y recortar las barras del path
            var file_name = file_split[2]; // [ 'uploads', 'users', 'pWgu0s-hHBgJl-5w1RSPS5G7.jpg' ]
    
            var ext_split = file_name.split('\.');
            var file_ext = ext_split [1]; //Comprueba si es un jpg [ 'j5HRZbfL7qgOgp2YRQ3F0ub8', 'jpg' ]
            TextBlock.findByIdAndUpdate(tbId, {$push: {files: file_name}}, (err, textblockUpdated) =>{
                if(err){
                    logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                    res.status(500).send({message: 'Error al actualizar el usuario'});
                }else{
                    if(!textblockUpdated){
                        logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                        res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                    }
                }
            });
        }
        logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
        res.status(200).send({message:'Adjuntos subidos correctamente'});
    }else{
        logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Solicitud de '+req.params.id}});
                res.status(200).send({message: 'No ha subido ninguna imagen'});
    }
}


function getFile(req, res){
    var file = req.params.fileName;
    var pathFile = './uploads/attachs/'+file;

    fs.exists(pathFile, function(exists){
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
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