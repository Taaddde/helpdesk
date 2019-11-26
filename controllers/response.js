'use strict'

var Response = require('../models/response');
//Sistema de log
var logger = require('../services/logger');

function getResponse(req, res){
    var responseId = req.params.id;

    Response.findById(responseId, (err, response) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!response){
                res.status(404).send({message: 'La respuesta no existe'});
            }else{
                res.status(200).send({response});
            }
        }
    });
}

function saveResponse(req, res){
    var response = new Response();

    var params = req.body;

    response.hashtag = params.hashtag;
    response.resp = params.resp;
    response.user = params.user;

    response.save((err, responseStored) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la petición'})
        }else{
            if(!responseStored){
                res.status(404).send({message: 'El respuesta no ha sido guardado'})
            }else{
                res.status(200).send({response:responseStored})
            }
        }
    });
}


function getResponses(req, res){
    var userId = req.params.userId;

    Response.find({user:userId}).sort('hashtag').exec(function(err, responses){
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!responses){
                res.status(404).send({message: 'No hay respuestas'})
            }else{
                return res.status(200).send({
                    responses: responses
                });
            }
        }
    });
}

function getResponsesForName(req, res){
    var hashtag = req.params.hashtag;
    Response.find({hashtag: { "$regex": hashtag, "$options": "i" }}).sort('hashtag').exec(function(err, responses){
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!responses){
                res.status(404).send({message: 'No hay respuestas'})
            }else{
                return res.status(200).send({
                    responses: responses
                });
            }
        }
    });
}

function updateResponse(req, res){
    var responseId = req.params.id;
    var update =  req.body;

    //responseId = response buscado, update = datos nuevos a actualizar
    Response.findByIdAndUpdate(responseId, update, (err, responseUpdated) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!responseUpdated){
                res.status(404).send({message: 'No se ha encontrado el respuesta'});
            }else{
                res.status(200).send({response:responseUpdated});
            }
        }
    });
}

function deleteResponse(req, res){
    var responseId = req.params.id;

    Response.findByIdAndDelete(responseId, (err, responseRemoved) =>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!responseRemoved){
                res.status(404).send({message: 'No se ha encontrado el respuesta'});
            }else{
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