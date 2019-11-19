'use strict'

var Ticket = require('../models/ticket');
var TextBlock = require('../models/textblock');
const moment = require('moment');
const mongoose =require('mongoose')

const ObjectId = mongoose.Types.ObjectId;

var moment_tz = require('moment-timezone');

function getTicket(req, res){
    var populateQuery = [
        {path:'requester',select:['name','surname','image','email']},
        {path:'agent',select:['name','surname','image']}, 
        {path:'team',select:['users','name','image'], populate:{path: 'users', model: 'User',select:['name','surname','image']}},
        {path:'company'},
        {path:'subTypeTicket',select:['name','typeTicket'], populate:{path: 'typeTicket'}}
    ];
    var ticketId = req.params.id;

    Ticket.findById(ticketId, (err, ticket) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!ticket){
                res.status(404).send({message: 'El ticket no existe'});
            }else{
                res.status(200).send({ticket});
            }
        }
    }).populate(populateQuery);
}

function getTicketsForUser(req, res){
    var userId = req.params.id;

    Ticket.find({$or: [{agent: userId}, {requester: userId}]}, (err, tickets) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!tickets){
                res.status(404).send({message: 'El ticket no existe'});
            }else{
                res.status(200).send({tickets});
            }
        }
    });
}


function getCountTickets(req, res){

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
            res.status(500).send({message: 'Error del servidor en la peticion',err:err});
        }else{
            if(!tickets){
                res.status(404).send({message: 'El ticket no existe'});
            }else{
                res.status(200).send({tickets});
            }
        }
    });
}

function getCountReqTickets(req, res){

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
            res.status(500).send({message: 'Error del servidor en la peticion',err:err});
        }else{
            if(!tickets){
                res.status(404).send({message: 'El ticket no existe'});
            }else{
                res.status(200).send({tickets});
            }
        }
    });
}

function getUnreadTickets(req, res){

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
            res.status(500).send({message: 'Error del servidor en la peticion',err:err});
        }else{
            if(!textblocks){
                res.status(404).send({message: 'No se encontro el elemento'});
            }else{
                res.status(200).send({textblocks:textblocks});                            
            }
        }
    })
}

function getUnreadTicketsReq(req, res){

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
            res.status(500).send({message: 'Error del servidor en la peticion',err:err});
        }else{
            if(!textblocks){
                res.status(404).send({message: 'No se encontro el elemento'});
            }else{
                res.status(200).send({textblocks:textblocks});                            
            }
        }
    })
}


function getTicketReports(req, res){

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
            res.status(500).send({message: 'Error del servidor en la peticion',err:err});
        }else{
            if(!tickets){
                res.status(404).send({message: 'No se encontro el elemento'});
            }else{
                res.status(200).send({tickets:tickets});                            
            }
        }
    })
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

function getTicketsPaged(req, res){
    var populateQuery = [
        {path:'requester',select:['name','surname','image']},
        {path:'agent',select:['name','surname','image']}, 
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
                res.status(500).send({message: 'Error en la peticion'})
            }else{
                if(!tickets){
                    res.status(404).send({message: 'No hay items'})
                }else{
                    return res.status(200).send({
                        tickets
                    });
                }
            }
        });
}

function getReqTicketsPaged(req, res){
    var populateQuery = [
        {path:'requester',select:['name','surname','image']},
        {path:'agent',select:['name','surname','image']}, 
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
            res.status(500).send({message: 'Error en la peticion'})
        }else{
            if(!tickets){
                res.status(404).send({message: 'No hay items'})
            }else{
                return res.status(200).send({
                    tickets
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


function getTicketsForName(req, res){
    var populateQuery = [
        {path:'requester',select:['name','surname','image']},
        {path:'agent',select:['name','surname','image']}, 
    ];

    var sub = req.params.sub;
    var company = req.params.company;

    Ticket.find({sub:{ "$regex": sub, "$options": "i" }, company:ObjectId(company)}).populate(populateQuery).exec(function(err, tickets){
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


function updateTicket(req, res){
    var ticketId = req.params.id;
    var update =  req.body;

    req.body.lastActivity = moment().format("DD-MM-YYYY HH:mm");
    //ticketId = ticket buscado, update = datos nuevos a actualizar
    Ticket.findByIdAndUpdate(ticketId, update, (err, ticketUpdated) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la petición',err:err});
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

    saveTicket,
    updateTicket,
    deleteTicket,
};