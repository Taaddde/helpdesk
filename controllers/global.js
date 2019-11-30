'use strict'

var Company = require('../models/company');
var User = require('../models/user');
var Ticket = require('../models/ticket');
var Team = require('../models/team');
var mail = require('../services/mail');

//Sistema de log
var logger = require('../services/logger');
var jwt_decode = require('jwt-decode');
const mongoose =require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


//Sistema de ficheros
var fs = require('fs');
var path = require('path');


function getCountSearch(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getCountSearch';
    var name = req.params.name;
    var company = req.params.company

    var companyQuery =
        [
            {
              $match: {name: { "$regex": name, "$options": "i" }}
            },
            {
              $count: "companyCount"
            }
        ];

    var userQuery =
    [
        {
            $match: {$or: [
                {name: { "$regex": name, "$options": "i" }, company:ObjectId(company)}, 
                {surname: { "$regex": name, "$options": "i" }, company:ObjectId(company)}
            ]}
        }
        ,
        {
            $count: "userCount"
        }
    ];

    var ticketQuery =
    [
        {
            $match: {company:ObjectId(company) , sub: { "$regex": name, "$options": "i" }}, 
        },
        {
            $count: "ticketCount"
        },
    ]

    var teamQuery =
    [
        {
            $match: {company:ObjectId(company) , name: { "$regex": name, "$options": "i" }}, 
        },
        {
            $count: "teamCount"
        },
    ]

    var reqQuery =
    [
        {
            $match: {$or: [
                {name: { "$regex": name, "$options": "i" }, role:'ROLE_REQUESTER'}, 
                {surname: { "$regex": name, "$options": "i" },  role:'ROLE_REQUESTER'}
            ]}
        }
        ,
        {
            $count: "requesterCount"
        }
    ];

    Company.aggregate(companyQuery, (err, companies) =>{
        if(err){
                logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion', err:err});
        }else{
            if(!companies){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'El departamento no existe'});
            }else{
                User.aggregate(userQuery, (err, users) =>{
                    if(err){
                        logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                        res.status(500).send({message: 'Error del servidor en la peticion', err:err});
                    }else{
                        if(!users){
                            logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                            res.status(404).send({message: 'El usuario no existe'});
                        }else{
                            Ticket.aggregate(ticketQuery, (err, tickets) =>{
                                if(err){
                                    logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                                    res.status(500).send({message: 'Error del servidor en la peticion', err:err});
                                }else{
                                    if(!tickets){
                                        logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                                        res.status(404).send({message: 'El departamento no existe'});
                                    }else{
                                        Team.aggregate(teamQuery, (err, teams) =>{
                                            if(err){
                                                logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                                                res.status(500).send({message: 'Error del servidor en la peticion', err:err});
                                            }else{
                                                if(!teams){
                                                    logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                                                    res.status(404).send({message: 'El departamento no existe'});
                                                }else{
                                                    User.aggregate(reqQuery, (err, requesters) =>{
                                                        if(err){
                                                            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                                                            res.status(500).send({message: 'Error del servidor en la peticion', err:err});
                                                        }else{
                                                            if(!requesters){
                                                                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                                                                res.status(404).send({message: 'El departamento no existe'});
                                                            }else{
                                                                res.status(200).send({companies:companies[0], users:users[0], tickets:tickets[0], teams:teams[0], requesters:requesters[0]});
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

function sendMail(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'sendMail';
    let to = req.body.to;
    let sub = req.body.sub;
    let txt = req.body.txt;
    let c = req.body.company;

    Company.findById(c, (err, company) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!company){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'La compañia no existe'});
            }else{
                mail.send(company.email, company.password, to, sub, txt)
                res.status(200).send({mail:true});
            }
        }
    });    
}

module.exports = {
    getCountSearch,
    sendMail
};