
var SubTypeTicket = require('../models/subtype_ticket');

//Sistema de log
var logger = require('../services/logger');
var jwt_decode = require('jwt-decode');var path = require('path');


var populateQuery = [
    {path:'team', select:['_id','name', 'image']},
    {path:'typeTicket'},
]


function getSubTypeTicket(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getSubTypeTicket';
    var subTypeTicketId = req.params.id;

    SubTypeTicket.findById(subTypeTicketId, (err, subTypeTicket) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!subTypeTicket){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'El sub tipo de solicitud no existe'});
            }else{
                res.status(200).send({subTypeTicket});
            }
        }
    }).populate(populateQuery);
}

function saveSubTypeTicket(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'saveSubTypeTicket';
    var subTypeTicket = new SubTypeTicket();

    var params = req.body;

    subTypeTicket.name = params.name;
    subTypeTicket.team = params.team;
    subTypeTicket.desc = params.desc;
    subTypeTicket.resolveDays = params.resolveDays;


    subTypeTicket.typeTicket = params.typeTicket;
    subTypeTicket.requireAttach = params.requireAttach;

    subTypeTicket.save((err, subTypeTicketStored) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'})
        }else{
            if(!subTypeTicketStored){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'el subtipo no ha sido guardado'})
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({subTypeTicket:subTypeTicketStored})
            }
        }
    });
}


function getSubTypeTickets(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getSubTypeTickets';
    var typeId = req.params.typeId;

    SubTypeTicket.find({typeTicket:typeId, deleted:false}).populate(populateQuery).sort('name').exec(function(err, subTypeTickets){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!subTypeTickets){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay respuestas'})
            }else{
                res.status(200).send({
                    subTypeTickets: subTypeTickets
                });
            }
        }
    });
}

function getSubTypeTicketsForName(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getSubTypeTicketsForName';
    var name = req.params.name;
    var typeId = req.params.typeId;
    SubTypeTicket.find({name: { "$regex": name, "$options": "i" }, deleted:false, typeTicket:typeId}).populate(populateQuery).sort('name').exec(function(err, subTypeTickets){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!subTypeTickets){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay respuestas'})
            }else{
                res.status(200).send({
                    subTypeTickets: subTypeTickets
                });
            }
        }
    });
}

function addGoodCheck(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'addGoodCheck';
    var subTypeTicketId = req.params.id;
    var update = {$inc: {goodChecks: 1}};

    //subTypeTicketId = subTypeTicket buscado, update = datos nuevos a actualizar
    SubTypeTicket.findByIdAndUpdate(subTypeTicketId, update, (err, subTypeTicketUpdated) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!subTypeTicketUpdated){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado el subtipo'});
            }else{
                logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({subTypeTicket:subTypeTicketUpdated});
            }
        }
    });
}

function addCheck(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'addCheck';
    var subTypeTicketId = req.params.id;
    var update = {$push:{checks:req.body.check}}

    SubTypeTicket.findByIdAndUpdate(subTypeTicketId, update, (err, subTypeTicketUpdated) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!subTypeTicketUpdated){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado el subtipo'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({subTypeTicket:subTypeTicketUpdated});
            }
        }
    });

}

function updateSubTypeTicket(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'updateSubTypeTicket';
    var subTypeTicketId = req.params.id;
    var update =  req.body;

    //subTypeTicketId = subTypeTicket buscado, update = datos nuevos a actualizar
    SubTypeTicket.findByIdAndUpdate(subTypeTicketId, update, (err, subTypeTicketUpdated) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!subTypeTicketUpdated){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado el subtipo'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({subTypeTicket:subTypeTicketUpdated});
            }
        }
    });
}

function deleteSubTypeTicket(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'deleteSubTypeTicket';
    var subTypeTicketId = req.params.id;

    SubTypeTicket.findByIdAndUpdate(subTypeTicketId, {deleted:true}, (err, subTypeTicketRemoved) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!subTypeTicketRemoved){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado el subtipo'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({subTypeTicket: subTypeTicketRemoved});
            }
        }
    });
}

function deleteCheck(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'deleteCheck';

    var subTypeTicketId = req.params.id;
    var check = req.body.check;

    SubTypeTicket.findByIdAndUpdate(subTypeTicketId,{$pull: {checks:check}}, (err, checkRemoved) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!checkRemoved){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado el subtipo'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
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