'use strict'
var Chat = require('../models/chat');

//Sistema de log
var logger = require('../services/logger');
var jwt_decode = require('jwt-decode');var path = require('path');

//Control de tiempo
const moment = require('moment');

function getOne(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getOne';
    var chatId = req.params.id;
    var populateQuery = [
        {path:'requester',select:['name','surname','image']},
        {path:'agent',select:['name','surname','image']}, 
        {path:'company',select:['name','email','image','mailSender']},
        {path:'team',select:['name','image']}
    ];

    Chat.findById(chatId, (err, chat) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!chat){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'El chat no existe'});
            }else{
                res.status(200).send({chat});
            }
        }
    }).populate(populateQuery);
}

function save(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'save';
    var chat = new Chat();
    var params = req.body;

    Chat.countDocuments({}, function(err, count) {
        chat.num = count+1;
        chat.requester = params.requester;
        chat.agent = params.agent;
        chat.team = params.team;
        chat.company = params.company;

    
        chat.save((err, chatStored) =>{
            if(err){
                logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: err})
            }else{
                if(!chatStored){
                    logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'El chat no ha sido guardado'})
                }else{
                    logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                    res.status(200).send({chat:chatStored})
                }
            }
        });    
    });
}


function getPagedList(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getPagedList';
    var populateQuery = [
        {path:'requester',select:['name','surname','image']},
        {path:'agent',select:['name','surname','image']}, 
        {path:'company',select:['name','email','image','mailSender']},
        {path:'team',select:['name','image']}
    ];

    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;
    }
    var perPage = req.params.perPage;

    var query = req.query;
    var sort = {num:-1}

    //Parche por errores del http
    /*
    if(query['requester'] && (query['requester'][0] == query['requester'][1])){
        query['requester'] = query['requester'][0];
    }

    if(query['status'] && query['status'] == 'Finalizado'){
        query['status'] = {$in:['Finalizado','Cerrado']};
    }

    if(query['requester']){
        query['$or'] = [{requester: query['requester']},{cc: ObjectId(query['requester'])}]
        remove query['requester']
    }*/

    Chat.paginate(query,{page:page, limit:perPage, populate:populateQuery, sort:sort}, function(err, chats){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            console.log(err)
            res.status(500).send({message: err})
        }else{
            if(!chats){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay items'})
            }else{
                res.status(200).send({chats:chats});
            }
        }
    });
}

function update(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'update';
    var chatId = req.params.id;
    var update =  req.body;

    //chatId = chat buscado, update = datos nuevos a actualizar
    Chat.findByIdAndUpdate(chatId, update, (err, chatUpdated) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!chatUpdated){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado El chat'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({chat:chatUpdated});
            }
        }
    });
}

function remove(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'remove';
    var chatId = req.params.id;

    Chat.findByIdAndRemove(chatId, (err, chatRemoved) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!chatRemoved){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado El chat'});
            }else{
                logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({chat: chatRemoved});
            }
        }
    });
}

module.exports = {
    getOne,
    getPagedList,

    save,
    update,
    remove,
};