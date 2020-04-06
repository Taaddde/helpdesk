'use strict'
var Message = require('../models/message');

//Sistema de log
var logger = require('../services/logger');
var jwt_decode = require('jwt-decode');var path = require('path');

//Control de tiempo
const moment = require('moment');

function getOne(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getOne';
    var messageId = req.params.id;

    Message.findById(messageId, (err, message) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!message){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'El message no existe'});
            }else{
                res.status(200).send({message});
            }
        }
    });
}

function save(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'save';
    var message = new Message();
    var params = req.body;

    message.text = params.text;
    message.chat = params.chat;
    message.user = params.user;
    message.date = moment().locale('es').format("YY-MMM-DD HH:mm");

    message.save((err, messageStored) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: err})
        }else{
            if(!messageStored){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
            res.status(404).send({message: 'El message no ha sido guardado'})
            }else{
                logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({message:messageStored})
            }
        }
    });
}


function getList(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getList';
    var populateQuery = [
        {path:'user',select:['name','surname','image', 'role']},
        {path:'chat',select:['requester','agent','team','company'], 
        populate:[
            {path: 'requester', model: 'User',select:['name','surname','image']},
            {path: 'agent', model: 'User',select:['name','surname','image',]},
            {path: 'team', model: 'Team',select:['name','image']},
            {path: 'company', model: 'Company',select:['name','email','image','mailSender']}

        ]},
    ];

    Message.find({chat:req.params.id}).sort('date').populate(populateQuery).exec(function(err, messages){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!messages){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay messages'})
            }else{
                res.status(200).send({messages: messages});
            }
        }
    });
}

function update(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'update';
    var messageId = req.params.id;
    var update =  req.body;

    //messageId = message buscado, update = datos nuevos a actualizar
    Message.findByIdAndUpdate(messageId, update, (err, messageUpdated) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!messageUpdated){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado El message'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({message:messageUpdated});
            }
        }
    });
}

function read(req, res){
    var decoded = jwt_decode(req.headers.authorization);
        var functionName = 'read';
        var chatId = req.params.id;
        var update =  {readed:true};
    
        //messageId = message buscado, update = datos nuevos a actualizar
        Message.updateMany({chat:chatId}, update, (err, messageUpdated) =>{
            if(err){
                logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                    res.status(500).send({message: 'Error del servidor en la petición'});
            }else{
                if(!messageUpdated){
                    logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                    res.status(404).send({message: 'No se ha encontrado El message'});
                }else{
                    res.status(200).send({message:messageUpdated});
                }
            }
        });
    }
    

function remove(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'remove';
    var messageId = req.params.id;

    Message.findByIdAndRemove(messageId, (err, messageRemoved) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!messageRemoved){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado El message'});
            }else{
                logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({message: messageRemoved});
            }
        }
    });
}

module.exports = {
    getOne,
    getList,

    save,
    update,
    remove,
    read
};