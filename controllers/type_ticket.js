'use strict'

var TypeTicket = require('../models/type_ticket');

var populateQuery = [
    {path:'company'},
]


function getTypeTicket(req, res){
    var typeTicketId = req.params.id;

    TypeTicket.findById(typeTicketId, (err, typeTicket) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!typeTicket){
                res.status(404).send({message: 'El tipo de solicitud no existe'});
            }else{
                res.status(200).send({typeTicket});
            }
        }
    }).populate(populateQuery);
}

function saveTypeTicket(req, res){
    var typeTicket = new TypeTicket();

    var params = req.body;

    typeTicket.name = params.name;
    typeTicket.company = params.company;

    typeTicket.save((err, typeTicketStored) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la petición'})
        }else{
            if(!typeTicketStored){
                res.status(404).send({message: 'El respuesta no ha sido guardado'})
            }else{
                res.status(200).send({typeTicket:typeTicketStored})
            }
        }
    });
}


function getTypeTickets(req, res){
    var company = req.params.company;

    TypeTicket.find({company:company}).populate(populateQuery).sort('name').exec(function(err, typeTickets){
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!typeTickets){
                res.status(404).send({message: 'No hay respuestas'})
            }else{
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
    TypeTicket.find({name: { "$regex": name, "$options": "i" }, company:company}).populate(populateQuery).sort('name').exec(function(err, typeTickets){
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!typeTickets){
                res.status(404).send({message: 'No hay respuestas'})
            }else{
                return res.status(200).send({
                    typeTickets: typeTickets
                });
            }
        }
    });
}

function updateTypeTicket(req, res){
    var typeTicketId = req.params.id;
    var update =  req.body;

    //typeTicketId = typeTicket buscado, update = datos nuevos a actualizar
    TypeTicket.findByIdAndUpdate(typeTicketId, update, (err, typeTicketUpdated) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!typeTicketUpdated){
                res.status(404).send({message: 'No se ha encontrado el respuesta'});
            }else{
                res.status(200).send({typeTicket:typeTicketUpdated});
            }
        }
    });
}

function deletetypeTicket(req, res){
    var typeTicketId = req.params.id;

    TypeTicket.findByIdAndDelete(typeTicketId, (err, typeTicketRemoved) =>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!typeTicketRemoved){
                res.status(404).send({message: 'No se ha encontrado el respuesta'});
            }else{
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