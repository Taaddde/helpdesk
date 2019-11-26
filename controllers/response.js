
var Response = require('../models/response');
//Sistema de log
var logger = require('../services/logger');
var jwt_decode = require('jwt-decode');var path = require('path');


function getResponse(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var responseId = req.params.id;
    var functionName = 'getResponse';

    Response.findById(responseId, (err, response) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!response){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'La respuesta no existe'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({response});
            }
        }
    });
}

function saveResponse(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'saveResponse';
    var response = new Response();

    var params = req.body;

    response.hashtag = params.hashtag;
    response.resp = params.resp;
    response.user = params.user;

    response.save((err, responseStored) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'})
        }else{
            if(!responseStored){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'El respuesta no ha sido guardado'})
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({response:responseStored})
            }
        }
    });
}


function getResponses(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getResponses';
    var userId = req.params.userId;

    Response.find({user:userId}).sort('hashtag').exec(function(err, responses){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!responses){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay respuestas'})
            }else{
                          logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({
                    responses: responses
                });
            }
        }
    });
}

function getResponsesForName(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getResponsesForName';
    var hashtag = req.params.hashtag;
    Response.find({hashtag: { "$regex": hashtag, "$options": "i" }}).sort('hashtag').exec(function(err, responses){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!responses){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay respuestas'})
            }else{
                          logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({
                    responses: responses
                });
            }
        }
    });
}

function updateResponse(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'updateResponse';
    var responseId = req.params.id;
    var update =  req.body;

    //responseId = response buscado, update = datos nuevos a actualizar
    Response.findByIdAndUpdate(responseId, update, (err, responseUpdated) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!responseUpdated){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado el respuesta'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({response:responseUpdated});
            }
        }
    });
}

function deleteResponse(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'deleteResponse';
    var responseId = req.params.id;

    Response.findByIdAndDelete(responseId, (err, responseRemoved) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!responseRemoved){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado el respuesta'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({response: responseRemoved});
            }
        }
    });
}

module.exports = {
    getResponse,
    getResponsesForName,
    getResponses,

    saveResponse,
    updateResponse,
    deleteResponse,
};