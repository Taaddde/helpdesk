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
        {path:'subTypeTicket',select:['name','typeTicket'], populate:{path: 'typeTicket'}},
        {path:'cc', model:'User', select:['name','surname','image', 'email']}
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

    Ticket.find({$or: [{agent: userId}, {requester: userId}]}).sort({numTicket:-1}).exec((err, tickets) =>{
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
          $match : { $or:[{requester: ObjectId(userId)},{cc:ObjectId(userId)}] }
          
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
              "byWorkTime":  [
                {
                    $match:
                    {
                        workTime: {$ne: null},
                        lastActivity: { $lte: moment().format("YYYY-MM-DD")+" 23:59" },
                        lastActivity: { $gte: moment().format("YYYY-MM-DD")+" 00:00" },
                        $or: [
                            {
                                status: 'Finalizado',
                            },
                            {
                                status: 'Cerrado'
                            }
                        ]
                        
                    }
                },
                {
                    $group:
                    {
                        _id: {
                            agent: "$agent",
                        },
                        ticketsCount:{$sum:1},
                        timeWorked:{$avg:"$realWorkTime"}
                    }
                },
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
                        ticketsCount:1, 
                        timeWorked:1, 
                        _id :{
                            agent: {
                                _id:1,
                                name:1,
                                surname:1,
                            },
                        }
                    }
                },
                ]
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
        ticket.createDate = moment().format("YYYY-MM-DD HH:mm");
        ticket.lastActivity = moment().format("YYYY-MM-DD HH:mm");
        ticket.priority = params.priority;
        ticket.company = params.company;
        ticket.resolveDate = params.resolveDate;
        ticket.subTypeTicket = params.subTypeTicket;
        ticket.workTime = params.workTime;
    
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

    var query = {$or:[{requester:userId},{cc:userId}]};

    if(status){
        if(status == 'Finalizado' || status == 'Cerrado'){
            query = {$and:[{$or:[{requester:userId},{cc:userId}]}, {$or: [ {status:'Finalizado'}, {status:'Cerrado'} ]}]};
        }else{
            query = {$and:[{$or:[{requester:userId},{cc:userId}]}, {$or: [ {status:'Abierto'}, {status:'Pendiente'} ]}]};
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

    req.body.lastActivity = moment().format("YYYY-MM-DD HH:mm");
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
                var status = ['Pendiente','Abierto'];
            
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

function checkClose(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'checkClose';
    let now = moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm');
    var query = 
    {
        status:'Finalizado', 
        lastActivity:{$lte: now}
    }
    var update =  {status:'Cerrado'};
    //ticketId = ticket buscado, update = datos nuevos a actualizar
    Ticket.updateMany(query, update, (err, ticketUpdated) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la petición',err:err});
        }else{
            if(!ticketUpdated){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado el ticket'});
            }else{
                logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({tickets:ticketUpdated});
            }
        }
    });
}

    
function addCc(req, res){
        var decoded = jwt_decode(req.headers.authorization);
        var functionName = 'addCc';
        var ticketId = req.params.id;
        var user = req.body.user;
       
        Ticket.findByIdAndUpdate(
            ticketId,
            { $push: {"cc": {_id:user}}},
            {  safe: true, upsert: true},
            function(err, ticket) {
                if(err){
                    console.log(err);
                    return res.send(err);
                }else{
                    logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                    res.status(200).send({ticket:ticket});
            }
        });
}

function removeCc(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'removeCc';
    var ticketId = req.params.id;
    var user = req.body.user;
        
        Ticket.findByIdAndUpdate(
        ticketId,
        { $pull: {"cc": user}},
        {  safe: true, upsert: false},
        function(err, ticket) {
            if(err){
            console.log(err);
            return res.send(err);
            }
        logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Solicitud de '+req.params.id}});
        res.status(200).send({ticket:ticket});
    });
}

function getTimeWork(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getTimeWork';

    var query =  [
        {
            $match:
            {
                workTime: {$ne: null},
                company: ObjectId(req.params.companyId),
                $or: [
                    {
                        status: 'Finalizado',
                    },
                    {
                        status: 'Cerrado'
                    }
                ]
                
            }
        },
        {
            $group:
            {
                _id: {
                    subTypeTicket: "$subTypeTicket",
                },
                workTime: { $last: "$workTime" },
                avgRealWorkTime: { $avg: "$realWorkTime" },
                count:{$sum:1}
            }
        },
        {
            $lookup:
            {
                from: "subtypetickets",
                localField: "_id.subTypeTicket",
                foreignField: "_id",
                as: "_id.subTypeTicket"
            }
        },
        { 
            $unwind: 
            { 
                path: "$_id.subTypeTicket", 
                preserveNullAndEmptyArrays: true
            } 
        },
        {
            $lookup:
            {
                from: "teams",
                localField: "_id.subTypeTicket.team",
                foreignField: "_id",
                as: "_id.subTypeTicket.team"
            }
        },
        { 
            $unwind: 
            { 
                path: "$_id.subTypeTicket.team", 
                preserveNullAndEmptyArrays: true
            } 
        },
        {
            $lookup:
            {
                from: "typetickets",
                localField: "_id.subTypeTicket.typeTicket",
                foreignField: "_id",
                as: "_id.subTypeTicket.typeTicket"
            }
        },
        { 
            $unwind: 
            { 
                path: "$_id.subTypeTicket.typeTicket", 
                preserveNullAndEmptyArrays: true
            } 
        },
        { 
            $project: 
            { 
                "_id.subTypeTicket.resolveDays":0,
                "_id.subTypeTicket.checks":0,
                "_id.subTypeTicket.goodChecks":0,
                "_id.subTypeTicket.requireAttach":0,
                "_id.subTypeTicket.desc":0,
                "_id.subTypeTicket.deleted":0,
                "_id.subTypeTicket.autoSub":0,
                "_id.subTypeTicket.autoDesc":0,
                "_id.subTypeTicket.typeTicket.company":0,
                "_id.subTypeTicket.typeTicket.deleted":0,
                "_id.subTypeTicket.team.default":0,
                "_id.subTypeTicket.team.createDate":0,
                "_id.subTypeTicket.team.users":0,
                "_id.subTypeTicket.team.company":0,
                "_id.subTypeTicket.team.deleted":0,

            } 
        }
    ]
      


    Ticket.aggregate(query, (err, tickets) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!tickets){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay tickets'})
            }else{
                res.status(200).send({tickets:tickets})
            }
        }
    });
}

function getTypeTimeWork(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getTypeTimeWork';

    var subTypeTicket = ObjectId(req.params.subTypeTicket);
    var workTime = req.params.workTime;
    var perPage = 10;
    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;

    }

    var populateQuery = [
        {path:'agent',select:['name','surname','image']},
        {path:'subTypeTicket',select:['name']}, 
    ];

    var query = {
                    workTime: {$ne: null},
                    subTypeTicket: subTypeTicket,
                    workTime:workTime,
                    $or: [
                        {
                            status: 'Finalizado',
                        },
                        {
                            status: 'Cerrado'
                        }
                    ]
                }


    Ticket.paginate(query,{page:page, limit:perPage, populate:populateQuery}, function(err, tickets){
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

function getTimeWorkPhases(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getTimeWorkPhases';

    var subTypeTicket =  ObjectId(req.params.subTypeTicket);

    var query =  [
        {
            $match:
            {
                workTime: {$ne: null},
                subTypeTicket: subTypeTicket,
                $or: [
                    {
                        status: 'Finalizado',
                    },
                    {
                        status: 'Cerrado'
                    }
                ]
                
            }
        },
        {
            $group:
            {
                _id: "$workTime",
            }
        },
    ]
      


    Ticket.aggregate(query, (err, tickets) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!tickets){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay tickets'})
            }else{
                res.status(200).send({tickets:tickets})
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
    getTimeWork,
    getTypeTimeWork,
    getTimeWorkPhases,

    checkClose,
    addCc,
    removeCc,

    saveTicket,
    updateTicket,
    deleteTicket,
};