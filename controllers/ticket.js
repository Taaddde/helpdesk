'use strict'
var Ticket = require('../models/ticket');
var TextBlock = require('../models/textblock');
var Team = require('../models/team');
const moment = require('moment');
const mongoose =require('mongoose')

const ObjectId = mongoose.Types.ObjectId;

//Sistema de log
var logger = require('../services/logger');
var jwt_decode = require('jwt-decode');var path = require('path');



function getTicket(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getTicket';
    var populateQuery = [
        {path:'requester',select:['name','surname','image','email','receiveMail']},
        {path:'agent',select:['name','surname','image','email','receiveMail']},
        {path:'team',select:['users','name','image'], populate:{path: 'users', model: 'User',select:['name','surname','image']}},
        {path:'company',select:['name','email','image','mailSender']},
        {path:'subTypeTicket',select:['name','typeTicket'], populate:{path: 'typeTicket'}}
    ];
    var ticketId = req.params.id;

    Ticket.findById(ticketId, (err, ticket) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!ticket){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'El ticket no existe'});
            }else{
                res.status(200).send({ticket});
            }
        }
    }).populate(populateQuery);
}


function getTicketsForUser(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getTicketsForUser';
    var userId = req.params.id;

    Ticket.find({$or: [{agent: userId}, {requester: userId}]}, (err, tickets) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!tickets){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'El ticket no existe'});
            }else{
                res.status(200).send({tickets});
            }
        }
    });
}

function getCountTickets(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getCountTickets';

    let userId = req.params.userId
    let company = req.params.company

    let query =[
        // First Stage
        {
          $match : { $or: [ { agent: ObjectId(userId) }, { company:ObjectId(company), status: 'Abierto' } ] }
          
        },
        // Second Stage
        {
          $group : {
             _id : '$status' ,
             count: { $sum: 1 }
            },
        },
       ]

    Ticket.aggregate(query, (err, tickets) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion',err:err});
        }else{
            if(!tickets){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'El ticket no existe'});
            }else{
                res.status(200).send({tickets});
            }
        }
    });
}

function getDateTickets(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getDateTickets';
    let userId = req.params.userId

    let query =[
        // First Stage
        {
          $match : {  agent: ObjectId(userId), status:'Pendiente' }
        },
        // Second Stage
        {
          $project : {
             _id : 1,
             resolveDate:1,
             sub:1
            },
        },
       ]

    Ticket.aggregate(query, (err, tickets) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion',err:err});
        }else{
            if(!tickets){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'El ticket no existe'});
            }else{
                res.status(200).send({tickets});
            }
        }
    });
}

function getCountReqTickets(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getCountReqTickets';
    let userId = req.params.userId

    let query =[
        // First Stage
        {
          $match : { requester: ObjectId(userId) }
          
        },
        // Second Stage
        {
          $group : {
             _id : '$status' ,
             count: { $sum: 1 }
            },
        },
       ]

    Ticket.aggregate(query, (err, tickets) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion',err:err});
        }else{
            if(!tickets){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'El ticket no existe'});
            }else{
                res.status(200).send({tickets});
            }
        }
    });
}

function getUnreadTickets(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getUnreadTickets';
    let userId = req.params.userId;
    
    let query =[
        {
          $match : {read:false, type:'REQUEST'}
        },
        {
          $group : {
             _id : '$ticket' ,
             textblock: { $last: "$_id" },
             count: { $sum: 1 }
            },
        },
        { 
            $lookup: {
                from: 'textblocks', 
                localField: 'textblock', 
                foreignField: '_id', 
                as: 'tbDesc'} 
        },
        {
            $unwind:"$tbDesc"
        },
        {
            $lookup: {
                from: 'users', 
                localField: 'tbDesc.user', 
                foreignField: '_id', 
                as: 'tbDesc.user'} 
        },
        {
            $unwind:"$tbDesc.user"
        },
        {
            $lookup: {
                from: 'tickets', 
                localField: 'tbDesc.ticket', 
                foreignField: '_id', 
                as: 'tbDesc.ticket'} 
        },
        {
            $unwind:"$tbDesc.ticket"
        },
        {
            $lookup: {
                from: 'users', 
                localField: 'tbDesc.ticket.agent', 
                foreignField: '_id', 
                as: 'tbDesc.ticket.agent'} 
        },
        {
            $unwind:"$tbDesc.ticket.agent"
        },
        {
            $match : {'tbDesc.ticket.agent._id':ObjectId(userId)}
        },
        {
            $project : {
                _id:1, 
                count:1, 
                tbDesc :{
                    _id: 1,
                    createDate:1,
                    text: 1,
                    user: {
                        _id: 1,
                        name: 1,
                        surname: 1,
                        image: 1,
                    },
                    ticket: {
                        _id: 1,
                        numTicket: 1,
                        sub: 1,
                }
            }
        }
    }]
    TextBlock.aggregate(query, (err, textblocks) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion',err:err});
        }else{
            if(!textblocks){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se encontro el elemento'});
            }else{
                res.status(200).send({textblocks:textblocks});                            
            }
        }
    })
}

function getUnreadTicketsReq(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getUnreadTicketsReq';
    let userId = req.params.userId;
    
    let query =[
        {
          $match : {read:false, type:'PUBLIC'}
        },
        {
          $group : {
             _id : '$ticket' ,
             textblock: { $last: "$_id" },
             count: { $sum: 1 }
            },
        },
        { 
            $lookup: {
                from: 'textblocks', 
                localField: 'textblock', 
                foreignField: '_id', 
                as: 'tbDesc'} 
        },
        {
            $unwind:"$tbDesc"
        },
        {
            $lookup: {
                from: 'users', 
                localField: 'tbDesc.user', 
                foreignField: '_id', 
                as: 'tbDesc.user'} 
        },
        {
            $unwind:"$tbDesc.user"
        },
        {
            $lookup: {
                from: 'tickets', 
                localField: 'tbDesc.ticket', 
                foreignField: '_id', 
                as: 'tbDesc.ticket'} 
        },
        {
            $unwind:"$tbDesc.ticket"
        },
        {
            $lookup: {
                from: 'users', 
                localField: 'tbDesc.ticket.requester', 
                foreignField: '_id', 
                as: 'tbDesc.ticket.requester'} 
        },
        {
            $unwind:"$tbDesc.ticket.requester"
        },
        {
            $match : {'tbDesc.ticket.requester._id':ObjectId(userId)}
        },
        {
            $project : {
                _id:1, 
                count:1, 
                tbDesc :{
                    _id: 1,
                    createDate:1,
                    text: 1,
                    user: {
                        _id: 1,
                        name: 1,
                        surname: 1,
                        image: 1,
                    },
                    ticket: {
                        _id: 1,
                        numTicket: 1,
                        sub: 1,
                }
            }
        }
    }]
    TextBlock.aggregate(query, (err, textblocks) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion',err:err});
        }else{
            if(!textblocks){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se encontro el elemento'});
            }else{
                res.status(200).send({textblocks:textblocks});                            
            }
        }
    })
}

function getTicketReports(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getTicketReports';
    let company = req.params.company;

    let query =[
        {
            $match: {company: ObjectId(company)}
        },
        {
            $facet: {
              "byStatus": [
                {
                    $group : {
                        _id: "$status",
                        count: { $sum: 1 }
                    },
                },
              ],
              "byTime": [
                { 
                    $group : {
                        _id: {$substr: ['$createDate', 3, 7]},
                        count: { $sum: 1 }
                    } 
                },
              ],
              "byAgent": [
                {
                    $group : {
                        _id: {agent:"$agent",status:"$status"},
                        count: { $sum: 1 }
                    },
                },
                { $sort : {"_id.agent":1 }},
                {
                    $lookup: {
                        from: 'users', 
                        localField: '_id.agent', 
                        foreignField: '_id', 
                        as: '_id.agent'} 
                },
                {
                    $unwind:"$_id.agent"
                },
                {
                    $project : {
                        count:1, 
                        _id :{
                            agent: {
                                _id:1,
                                name:1,
                                surname:1,
                            },
                            status: 1,
                        }
                    }
                },
              ],
            },
        },
    ]
    Ticket.aggregate(query, (err, tickets) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion',err:err});
        }else{
            if(!tickets){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se encontro el elemento'});
            }else{
                res.status(200).send({tickets:tickets});                            
            }
        }
    })
}

function saveTicket(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'saveTicket';
    var ticket = new Ticket();
    var params = req.body;

    Ticket.countDocuments({}, function(err, count) {
        ticket.numTicket = count+1;
        ticket.sub = params.sub;
        ticket.requester = params.requester;
        ticket.agent = params.agent;
        ticket.status = params.status;
        ticket.rating = params.rating;
        ticket.team = params.team;
        ticket.source = params.source;
        ticket.createDate = moment().format("DD-MM-YYYY HH:mm");
        ticket.lastActivity = moment().format("DD-MM-YYYY HH:mm");
        ticket.priority = params.priority;
        ticket.company = params.company;
        ticket.resolveDate = params.resolveDate;
        ticket.subTypeTicket = params.subTypeTicket
    
        ticket.save((err, ticketStored) =>{
            if(err){
                logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: err})
            }else{
                if(!ticketStored){
                    logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'El ticket no ha sido guardado'})
                }else{
                  logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({ticket:ticketStored})
                }
            }
        });    
    });
}

function getTickets(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getTickets';
    var populateQuery = [
        {path:'requester',select:['name','surname','image']},
        {path:'agent',select:['name','surname','image']}, 
        {path:'company',select:['name','email','image','mailSender']}
    ];

    Ticket.find({}).sort('hashtag').populate(populateQuery).exec(function(err, tickets){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!tickets){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay tickets'})
            }else{
                res.status(200).send({
                    tickets: tickets
                });
            }
        }
    });
}

function getTicketsPaged(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getTicketsPaged';
    var populateQuery = [
        {path:'requester',select:['name','surname','image']},
        {path:'agent',select:['name','surname','image']}, 
        {path:'company',select:['name','email','image','mailSender']}
    ];

    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;
    }

    var perPage = req.params.perPage;
    var userId = req.params.userId;
    var status = req.params.status;
    var company = req.params.company;

    var query = {company:company};
    if(userId){
        query = {agent: userId,status: status, company:company};
        if(status == 'Finalizado'){
            query = {company:company, $or: [ {agent: userId,status: status}, {agent: userId,status:'Cerrado'} ]};
        }
    }else{
        if(status){
            if(status == 'Finalizado'){
                query = {company:company, $or: [ {status:status}, {status:'Cerrado'} ]};
            }else{
                query = {company:company, status:status};
            }
        }
    }
    
    
        Ticket.paginate(query,{page:page, limit:perPage, populate:populateQuery, sort:{numTicket:-1}}, function(err, tickets){
            if(err){
                logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error en la peticion'})
            }else{
                if(!tickets){
                    logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay items'})
                }else{
                res.status(200).send({
                        tickets
                    });
                }
            }
        });
}

function getReqTicketsPaged(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getReqTicketsPaged';
    var populateQuery = [
        {path:'requester',select:['name','surname','image']},
        {path:'agent',select:['name','surname','image']}, 
        {path:'company',select:['name','email','image','mailSender']}
    ];

    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;
    }

    var perPage = req.params.perPage;
    var userId = req.params.userId;
    var status = req.params.status;

    var query = {requester:userId};

    if(status){
        if(status == 'Finalizado' || status == 'Cerrado'){
            query = {requester:userId, $or: [ {status:'Finalizado'}, {status:'Cerrado'} ]};
        }else{
            query = {requester:userId, $or: [ {status:'Abierto'}, {status:'Pendiente'} ]};
        }
    }

    Ticket.paginate(query,{page:page, limit:perPage, populate:populateQuery, sort:{numTicket:-1}}, function(err, tickets){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error en la peticion'})
        }else{
            if(!tickets){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay items'})
            }else{
                res.status(200).send({
                    tickets
                });
            }
        }
    });
}


function getTicketsForNumber(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getTicketsForNumber';
    var num = req.params.num;
    Ticket.findOne({numTicket:num}).exec(function(err, ticket){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!ticket){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay tickets'})
            }else{
                res.status(200).send({
                    ticket: ticket
                });
            }
        }
    });
}


function getTicketsForName(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getTicketsForName';
    var populateQuery = [
        {path:'requester',select:['name','surname','image']},
        {path:'agent',select:['name','surname','image']}, 
        {path:'company',select:['name','email','image','mailSender']}
    ];

    var sub = req.params.sub;
    var company = req.params.company;

    Ticket.find({sub:{ "$regex": sub, "$options": "i" }, company:ObjectId(company)}).populate(populateQuery).exec(function(err, tickets){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!tickets){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay tickets'})
            }else{
                res.status(200).send({
                    tickets: tickets
                });
            }
        }
    });
}


function updateTicket(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'updateTicket';
    var ticketId = req.params.id;
    var update =  req.body;

    req.body.lastActivity = moment().format("DD-MM-YYYY HH:mm");
    //ticketId = ticket buscado, update = datos nuevos a actualizar
    Ticket.findByIdAndUpdate(ticketId, update, (err, ticketUpdated) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la petición',err:err});
        }else{
            if(!ticketUpdated){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado el ticket'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({ticket:ticketUpdated});
            }
        }
    });
}

function deleteTicket(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'deleteTicket';
    var ticketId = req.params.id;

    Ticket.findByIdAndDelete(ticketId, (err, ticketRemoved) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!ticketRemoved){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado el ticket'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({ticket: ticketRemoved});
            }
        }
    });
}

function getTeamTickets(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getTeamTickets';

    var userId = req.params.userId;


    Team.find({users:userId}).exec(function(err, teams){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!teams){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay tickets'})
            }else{
                var populateQuery = [
                    {path:'requester',select:['name','surname','image']},
                    {path:'agent',select:['name','surname','image']}, 
                    {path:'company',select:['name','email','image','mailSender']}
                ];
                
                if(req.params.page){
                    var page = req.params.page;
                }else{
                    var page = 1;
                }
            
                var perPage = req.params.perPage;
                var status = 'Pendiente';
            
                var query = {team:teams,status:status,$or:[{agent:null}, {agent:undefined}]};
                Ticket.paginate(query,{page:page, limit:perPage, populate:populateQuery, sort:{numTicket:-1}}, function(err, tickets){
                    if(err){
                        logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                        res.status(500).send({message: 'Error en la peticion'})
                    }else{
                        if(!tickets){
                            logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                        res.status(404).send({message: 'No hay items'})
                        }else{
                        res.status(200).send({
                                tickets
                            });
                        }
                    }
                });
            
            }
        }
    });



}
    

module.exports = {
    getTicket,
    getTicketsForNumber,
    getTicketsForName,
    getTickets,
    getTicketsPaged,
    getReqTicketsPaged,
    getTicketsForUser,
    getCountTickets,
    getCountReqTickets,
    getUnreadTickets,
    getUnreadTicketsReq,
    //getNotificationTickets,
    getTicketReports,
    getDateTickets,
    getTeamTickets,

    saveTicket,
    updateTicket,
    deleteTicket,
};