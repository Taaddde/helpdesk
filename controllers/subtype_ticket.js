'use strict'

var SubTypeTicket = require('../models/subtype_ticket');

//Sistema de log
var logger = require('../services/logger');

var populateQuery = [
    {path:'team', select:['_id','name', 'image']},
    {path:'typeTicket'},
]


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
    }).populate(populateQuery);
}

function saveSubTypeTicket(req, res){
    var subTypeTicket = new SubTypeTicket();

    var params = req.body;

    subTypeTicket.name = params.name;
    subTypeTicket.team = params.team;
    subTypeTicket.desc = params.desc;
    /* PARA CUANDO SE DEBA HACER EL CALCULO DE DIAS
    if(params.resolveDate){
        let day = moment().add(params.resolveDate, "days").format("DD-MM-YYYY");
        // 0 = DOM
        // 6 = SAB
        if(moment(day, "DD-MM-YYYY").weekday() == 6 || moment(day, "DD-MM-YYYY").weekday() == 0){ 
            day = moment(day, "DD-MM-YYYY").add(2, "days").format("DD-MM-YYYY");
        }
        subTypeTicket.resolveDate = day;
    }*/

    subTypeTicket.resolveDays = params.resolveDays;


    subTypeTicket.typeTicket = params.typeTicket;
    subTypeTicket.requireAttach = params.requireAttach;

    subTypeTicket.save((err, subTypeTicketStored) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la petición'})
        }else{
            if(!subTypeTicketStored){
                res.status(404).send({message: 'el subtipo no ha sido guardado'})
            }else{
                res.status(200).send({subTypeTicket:subTypeTicketStored})
            }
        }
    });
}


function getSubTypeTickets(req, res){
    var typeId = req.params.typeId;

    SubTypeTicket.find({typeTicket:typeId}).populate(populateQuery).sort('name').exec(function(err, subTypeTickets){
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
    var typeId = req.params.typeId;
    SubTypeTicket.find({name: { "$regex": name, "$options": "i" }, typeTicket:typeId}).populate(populateQuery).sort('name').exec(function(err, subTypeTickets){
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

function addGoodCheck(req, res){
    var subTypeTicketId = req.params.id;
    var update = {$inc: {goodChecks: 1}};

    //subTypeTicketId = subTypeTicket buscado, update = datos nuevos a actualizar
    SubTypeTicket.findByIdAndUpdate(subTypeTicketId, update, (err, subTypeTicketUpdated) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!subTypeTicketUpdated){
                res.status(404).send({message: 'No se ha encontrado el subtipo'});
            }else{
                res.status(200).send({subTypeTicket:subTypeTicketUpdated});
            }
        }
    });
}

function addCheck(req, res){
    var subTypeTicketId = req.params.id;
    var update = {$push:{checks:req.body.check}}

    SubTypeTicket.findByIdAndUpdate(subTypeTicketId, update, (err, subTypeTicketUpdated) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!subTypeTicketUpdated){
                res.status(404).send({message: 'No se ha encontrado el subtipo'});
            }else{
                res.status(200).send({subTypeTicket:subTypeTicketUpdated});
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
                res.status(404).send({message: 'No se ha encontrado el subtipo'});
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
                res.status(404).send({message: 'No se ha encontrado el subtipo'});
            }else{
                res.status(200).send({subTypeTicket: subTypeTicketRemoved});
            }
        }
    });
}

function deleteCheck(req, res){

    var subTypeTicketId = req.params.id;
    var check = req.body.check;

    SubTypeTicket.findByIdAndUpdate(subTypeTicketId,{$pull: {checks:check}}, (err, checkRemoved) =>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!checkRemoved){
                res.status(404).send({message: 'No se ha encontrado el subtipo'});
            }else{
                res.status(200).send({check: checkRemoved});
            }
        }
    });

}

module.exports = {
    getSubTypeTicket,
    getSubTypeTicketsForName,
    getSubTypeTickets,

    addGoodCheck,
    addCheck,
    saveSubTypeTicket,
    updateSubTypeTicket,
    deleteSubTypeTicket,
    deleteCheck,
};