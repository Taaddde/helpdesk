'use strict'

var SubTypeTicket = require('../models/subtype_ticket');

function getSubTypeTicket(req, res){
    var subTypeTicketId = req.params.id;

    SubTypeTicket.findById(subTypeTicketId, (err, subTypeTicket) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!subTypeTicket){
                res.status(404).send({message: 'El sub tipo de solicitud no existe'});
            }else{
                res.status(200).send({subTypeTicket});
            }
        }
    });
}

function saveSubTypeTicket(req, res){
    var subTypeTicket = new subTypeTicket();

    var params = req.body;

    subTypeTicket.name = params.name;
    subTypeTicket.team = params.team;
    subTypeTicket.resolveDate = params.resolveDate;
    subTypeTicket.typeTicket = params.typeTicket;
    subTypeTicket.checks = params.checks;
    subTypeTicket.requireAttach = params.requireAttach;

    subTypeTicket.save((err, subTypeTicketStored) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la petición'})
        }else{
            if(!subTypeTicketStored){
                res.status(404).send({message: 'El respuesta no ha sido guardado'})
            }else{
                res.status(200).send({subTypeTicket:subTypeTicketStored})
            }
        }
    });
}


function getSubTypeTickets(req, res){
    var typeId = req.params.typeId;

    SubTypeTicket.find({typeTicket:typeId}).sort('name').exec(function(err, subTypeTickets){
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!subTypeTickets){
                res.status(404).send({message: 'No hay respuestas'})
            }else{
                return res.status(200).send({
                    subTypeTickets: subTypeTickets
                });
            }
        }
    });
}

function getSubTypeTicketsForName(req, res){
    var name = req.params.name;
    var typeTicket = req.params.typeTicket;
    SubTypeTicket.find({name: { "$regex": name, "$options": "i" }, typeTicket:typeTicket}).sort('name').exec(function(err, subTypeTickets){
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!subTypeTickets){
                res.status(404).send({message: 'No hay respuestas'})
            }else{
                return res.status(200).send({
                    subTypeTickets: subTypeTickets
                });
            }
        }
    });
}

function updateSubTypeTicket(req, res){
    var subTypeTicketId = req.params.id;
    var update =  req.body;

    //subTypeTicketId = subTypeTicket buscado, update = datos nuevos a actualizar
    SubTypeTicket.findByIdAndUpdate(subTypeTicketId, update, (err, subTypeTicketUpdated) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!subTypeTicketUpdated){
                res.status(404).send({message: 'No se ha encontrado el respuesta'});
            }else{
                res.status(200).send({subTypeTicket:subTypeTicketUpdated});
            }
        }
    });
}

function deleteSubTypeTicket(req, res){
    var subTypeTicketId = req.params.id;

    SubTypeTicket.findByIdAndDelete(subTypeTicketId, (err, subTypeTicketRemoved) =>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!subTypeTicketRemoved){
                res.status(404).send({message: 'No se ha encontrado el respuesta'});
            }else{
                res.status(200).send({subTypeTicket: subTypeTicketRemoved});
            }
        }
    });
}

module.exports = {
    getSubTypeTicket,
    getSubTypeTicketsForName,
    getSubTypeTickets,

    saveSubTypeTicket,
    updateSubTypeTicket,
    deleteSubTypeTicket,
};