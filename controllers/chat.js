'use strict'
var Chat = require('../models/chat');
var Team = require('../models/team');
var Message = require('../models/message');

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
        chat.date = moment().locale('es').format("YY-MMM-DD HH:mm");


    
        chat.save((err, chatStored) =>{
            if(err){
                logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: err})
                console.log(err)
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

function getMyChats(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getMyChats';
    var userId = req.params.id;
    var populateQuery = [
        {path:'requester',select:['name','surname','image']},
        {path:'agent',select:['name','surname','image']}, 
        {path:'company',select:['name','email','image','mailSender']},
        {path:'team',select:['name','image']}
    ];

    Chat.find({agent:userId, finishedAgent:false}, (err, chats) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!chats){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'El chat no existe'});
            }else{
                res.status(200).send({chats});
            }
        }
    }).populate(populateQuery);
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

function getTeamList(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getTeamList';
    var userId = req.params.id;

    Team.find({users:userId}).exec(function(err, teams){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!teams){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay equipos'})
            }else{
                var populateQuery = [
                    {path:'requester',select:['name','surname','image']},
                    {path:'agent',select:['name','surname','image']}, 
                ];

                var query = {team:teams,finishedAgent:false, agent:undefined};
                Chat.find(query).populate(populateQuery).sort('date').exec(function(err, chats){
                    if(err){
                        console.log(err)
                        logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                        res.status(500).send({message: 'Error en la peticion'})
                    }else{
                        if(!chats){
                            logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                            res.status(404).send({message: 'No hay items'})
                        }else{
                        res.status(200).send({
                                chats
                            });
                        }
                    }
                });
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

function getNotification(req, res){
    let userId = req.params.id

    Chat.find({$or:[{agent: userId},{agent: undefined}], finishedAgent: false}).select({_id:1}).exec( function(err, chats) {
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(chats){
                Message.countDocuments({user: {$ne: userId}, chat: chats, readed: false}, function(err, c) {
                    if(err){
                        console.log(err);
                    }else{
                        res.status(200).send({count: c});
                    }
                });                
            }else{
                res.status(200).send({count: 0});
            }
           
        }
    });
}

function getForUser(req, res){
    let userId = req.params.id

 

    Chat.find({agent: userId, finishedAgent: false}).select({_id:1}).exec(function(err, chatsA) {
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!chatsA){
                res.status(404).send({message: 'No hay chats'});
            }else{
                Message.find({chat: chatsA, readed: false}).select({chat:1}).exec(function(err, chats) {
                    if(err){
                        res.status(500).send({message: 'Error en la petición'});
                    }else{
                        if(!chats){
                            res.status(404).send({message: 'No hay chats'});
                        }else{
                            res.status(200).send({chats:chats});
                        }
                       
                    }
                });
            }
           
        }
    });
}


function getReqNotification(req, res){
    let userId = req.params.id

    Chat.findOne({requester: userId, finishedRequester: false}, function(err, chat) {
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(chat){
                Message.countDocuments({user: {$ne: userId}, chat: chat._id, readed: false}, function(err, c) {
                    if(err){
                        console.log(err);
                    }else{
                        res.status(200).send({count: c});
                    }
                });
                
            }else{
                res.status(200).send({count: 0});
            }
           
        }
    });
}

function getReqForUser(req, res){
    let userId = req.params.id

    var populateQuery = [
        {path:'requester',select:['name','surname','image']},
        {path:'agent',select:['name','surname','image']}, 
        {path:'company',select:['name','email','image','mailSender']},
        {path:'team',select:['name','image']}
    ];

    Chat.findOne({requester: userId, finishedRequester: false}, function(err, chat) {
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!chat){
                res.status(404).send({message: 'No se ha encontrado chat'});
            }else{
                res.status(200).send({chat:chat});
            }
           
        }
    }).populate(populateQuery);
}


module.exports = {
    getOne,
    getPagedList,
    getTeamList,
    getMyChats,
    getReqNotification,
    getReqForUser,
    getNotification,
    getForUser,

    save,
    update,
    remove,
};