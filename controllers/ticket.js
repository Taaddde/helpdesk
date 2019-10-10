'use strict'

var Ticket = require('../models/ticket');
const moment = require('moment');
var moment_tz = require('moment-timezone');

function getTicket(req, res){
    var ticketId = req.params.id;

    Ticket.findById(ticketId, (err, ticket) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!ticket){
                res.status(404).send({message: 'La ticket no existe'});
            }else{
                res.status(200).send({ticket});
            }
        }
    });
}

function saveTicket(req, res){
    var ticket = new Ticket();
    var c;
    var params = req.body;

    Ticket.countDocuments({}, function(err, count) {
        ticket.numTicket = count+1;
        ticket.sub = params.sub;
        ticket.requester = params.requester;
        ticket.agent = params.agent;
        ticket.source = params.source;
        ticket.createDate = moment().format("DD-MM-YYYY HH:mm");
        ticket.lastActivity = moment().format("DD-MM-YYYY HH:mm");
    
        ticket.save((err, ticketStored) =>{
            if(err){
                res.status(500).send({message: 'Error del servidor en la petición'})
            }else{
                if(!ticketStored){
                    res.status(404).send({message: 'El ticket no ha sido guardado'})
                }else{
                    res.status(200).send({ticket:ticketStored})
                }
            }
        });    
    });
}


function getTickets(req, res){
    var populateQuery = [
        {path:'requester',select:['name','surname','image']},
        {path:'agent',select:['name','surname','image']}, 
    ];

    Ticket.find({}).sort('hashtag').populate(populateQuery).exec(function(err, tickets){
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!tickets){
                res.status(404).send({message: 'No hay tickets'})
            }else{
                return res.status(200).send({
                    tickets: tickets
                });
            }
        }
    });
}

function getTicketsForNumber(req, res){
    var num = req.params.num;
    Ticket.findOne({numTicket:num}).exec(function(err, ticket){
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!ticket){
                res.status(404).send({message: 'No hay tickets'})
            }else{
                return res.status(200).send({
                    ticket: ticket
                });
            }
        }
    });
}

function updateTicket(req, res){
    var ticketId = req.params.id;
    var update =  req.body;

    //ticketId = ticket buscado, update = datos nuevos a actualizar
    Ticket.findByIdAndUpdate(ticketId, update, (err, ticketUpdated) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!ticketUpdated){
                res.status(404).send({message: 'No se ha encontrado el ticket'});
            }else{
                res.status(200).send({ticket:ticketUpdated});
            }
        }
    });
}

function deleteTicket(req, res){
    var ticketId = req.params.id;

    Ticket.findByIdAndDelete(ticketId, (err, ticketRemoved) =>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!ticketRemoved){
                res.status(404).send({message: 'No se ha encontrado el ticket'});
            }else{
                res.status(200).send({ticket: ticketRemoved});
            }
        }
    });
}

module.exports = {
    getTicket,
    getTicketsForNumber,
    getTickets,

    saveTicket,
    updateTicket,
    deleteTicket,
};