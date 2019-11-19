'use strict'

var Company = require('../models/company');
var User = require('../models/user');
var Ticket = require('../models/ticket');
var Team = require('../models/team');
var mail = require('../services/mail');

const mongoose =require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


//Sistema de ficheros
var fs = require('fs');
var path = require('path');


function getCountSearch(req, res){

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

    Company.aggregate(companyQuery, (err, companies) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion', err:err});
        }else{
            if(!companies){
                res.status(404).send({message: 'El departamento no existe'});
            }else{
                User.aggregate(userQuery, (err, users) =>{
                    if(err){
                        res.status(500).send({message: 'Error del servidor en la peticion', err:err});
                    }else{
                        if(!users){
                            res.status(404).send({message: 'El usuario no existe'});
                        }else{
                            Ticket.aggregate(ticketQuery, (err, tickets) =>{
                                if(err){
                                    res.status(500).send({message: 'Error del servidor en la peticion', err:err});
                                }else{
                                    if(!tickets){
                                        res.status(404).send({message: 'El departamento no existe'});
                                    }else{
                                        Team.aggregate(teamQuery, (err, teams) =>{
                                            if(err){
                                                res.status(500).send({message: 'Error del servidor en la peticion', err:err});
                                            }else{
                                                if(!teams){
                                                    res.status(404).send({message: 'El departamento no existe'});
                                                }else{
                                                    res.status(200).send({companies:companies[0], users:users[0], tickets:tickets[0], teams:teams[0]});
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
    let to = req.body.to;
    let sub = req.body.sub;
    let txt = req.body.txt;
    console.log(to, sub, txt)
    if(mail.send(to, sub, txt)){
        res.status(500).send({message: 'Error del servidor en la peticion'});
    }else{
        res.status(200).send({mail:true});
    }
    
}

module.exports = {
    getCountSearch,
    sendMail
};