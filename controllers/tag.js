'use strict'
var Tag = require('../models/tag');

//Sistema de log
var logger = require('../services/logger');
var jwt_decode = require('jwt-decode');var path = require('path');


function getTag(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getTag';
    var tagId = req.params.id;

    Tag.findById(tagId, (err, tag) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' - '+req.ip+': '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!tag){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' - '+req.ip+': Objeto no encontrado'}});
                res.status(404).send({message: 'La etiqueta no existe'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' - '+req.ip+': Solicitud realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({tag});
            }
        }
    });
}

function saveTag(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'consaveTagtroller';
    var tag = new Tag();

    var params = req.body;

    tag.name = params.name;

    tag.save((err, tagStored) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' - '+req.ip+': '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'})
        }else{
            if(!tagStored){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' - '+req.ip+': Objeto no encontrado'}});
                res.status(404).send({message: 'La etiqueta no ha sido guardado'})
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' - '+req.ip+': Solicitud realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({tag:tagStored})
            }
        }
    });
}


function getTags(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getTags';
    Tag.find({}).sort('name').exec(function(err, tags){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' - '+req.ip+': '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!tags){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' - '+req.ip+': Objeto no encontrado'}});
                res.status(404).send({message: 'No hay etiquetas'})
            }else{
                          logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' - '+req.ip+': Solicitud realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({
                    tags: tags
                });
            }
        }
    });
}

function getTagsForName(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getTagsForName';
    var name = req.params.name;
    Tag.find({name: { "$regex": name, "$options": "i" }}).sort('name').exec(function(err, tags){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' - '+req.ip+': '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!tags){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' - '+req.ip+': Objeto no encontrado'}});
                res.status(404).send({message: 'No hay etiquetas'})
            }else{
                          logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' - '+req.ip+': Solicitud realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({
                    tags: tags
                });
            }
        }
    });
}

function updateTag(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'updateTag';
    var tagId = req.params.id;
    var update =  req.body;

    //tagId = tag buscado, update = datos nuevos a actualizar
    Tag.findByIdAndUpdate(tagId, update, (err, tagUpdated) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' - '+req.ip+': '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!tagUpdated){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' - '+req.ip+': Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado La etiqueta'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' - '+req.ip+': Solicitud realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({tag:tagUpdated});
            }
        }
    });
}

function deleteTag(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'deleteTag';
    var tagId = req.params.id;

    Tag.findByIdAndDelete(tagId, (err, tagRemoved) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' - '+req.ip+': '+err}});
                res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!tagRemoved){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' - '+req.ip+': Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado La etiqueta'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' - '+req.ip+': Solicitud realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({tag: tagRemoved});
            }
        }
    });
}

module.exports = {
    getTag,
    getTagsForName,
    getTags,

    saveTag,
    updateTag,
    deleteTag,
};