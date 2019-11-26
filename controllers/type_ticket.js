'use strict'

var TypeTicket = require('../models/type_ticket');
//Sistema de log
var logger = require('../services/logger');
var path = require('path');

var populateQuery = [
    {path:'company',select:['name','email','image','mailSender']}
]


function getTypeTicket(req, res){
    var typeTicketId = req.params.id;
    var functionName = 'controller';


    TypeTicket.findById(typeTicketId, (err, typeTicket) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!typeTicket){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Objeto no encontrado'}});
                res.status(404).send({message: 'El tipo de solicitud no existe'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Solicitud realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({typeTicket});
            }
        }
    }).populate(populateQuery);
}

function saveTypeTicket(req, res){
    var functionName = 'controller';

    var typeTicket = new TypeTicket();

    var params = req.body;

    typeTicket.name = params.name;
    typeTicket.company = params.company;

    typeTicket.save((err, typeTicketStored) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'})
        }else{
            if(!typeTicketStored){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Objeto no encontrado'}});
                res.status(404).send({message: 'El respuesta no ha sido guardado'})
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Solicitud realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({typeTicket:typeTicketStored})
            }
        }
    });
}


function getTypeTickets(req, res){
    var company = req.params.company;
    var functionName = 'controller';


    TypeTicket.find({company:company}).populate(populateQuery).sort('name').exec(function(err, typeTickets){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!typeTickets){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Objeto no encontrado'}});
                res.status(404).send({message: 'No hay respuestas'})
            }else{
                          logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Solicitud realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                return res.status(200).send({
                    typeTickets: typeTickets
                });
            }
        }
    })
}

function getTypeTicketsForName(req, res){
    var name = req.params.name;
    var company = req.params.company;
    var functionName = 'controller';

    TypeTicket.find({name: { "$regex": name, "$options": "i" }, company:company}).populate(populateQuery).sort('name').exec(function(err, typeTickets){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!typeTickets){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Objeto no encontrado'}});
                res.status(404).send({message: 'No hay respuestas'})
            }else{
                          logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Solicitud realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({
                    typeTickets: typeTickets
                });
            }
        }
    });
}

function updateTypeTicket(req, res){
    var typeTicketId = req.params.id;
    var update =  req.body;
    var functionName = 'controller';


    //typeTicketId = typeTicket buscado, update = datos nuevos a actualizar
    TypeTicket.findByIdAndUpdate(typeTicketId, update, (err, typeTicketUpdated) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!typeTicketUpdated){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado el respuesta'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Solicitud realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({typeTicket:typeTicketUpdated});
            }
        }
    });
}

function deletetypeTicket(req, res){
    var typeTicketId = req.params.id;
    var functionName = 'controller';


    TypeTicket.findByIdAndDelete(typeTicketId, (err, typeTicketRemoved) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': '+err}});
                res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!typeTicketRemoved){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado el respuesta'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: req.ip+': Solicitud realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({typeTicket: typeTicketRemoved});
            }
        }
    });
}

module.exports = {
    getTypeTicket,
    getTypeTicketsForName,
    getTypeTickets,

    saveTypeTicket,
    updateTypeTicket,
    deletetypeTicket,
};