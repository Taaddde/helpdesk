'use strict'
var moment = require('moment');

var User = require('../models/user');
var Team = require('../models/team');
//Sistema de ficheros
var fs = require('fs');
var path = require('path');

//Sistema de log
var logger = require('../services/logger');
var jwt_decode = require('jwt-decode');

function getAgentsInTeam(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getAgentsInTeam';
    var teamId = req.params.id;
    var company = req.params.company;

    var populateQuery = [
        {path:'users', model:'User', select:['name','surname','image']},
        {path:'company',select:['name','email','image','mailSender']}
    ];

    Team.findById(teamId, (err, team) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!team){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'El equipo no existe'});
            }else{
                User.find({_id:{$nin:team.users}, company:company, $or: [{role: 'ROLE_AGENT'}, {role: 'ROLE_ADMIN'}]},(err, users) =>{
                    if(err){
                        logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion', err:err});
                    }else{
                        if(!users){
                            logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'Los usuarios no existen'});
                        }else{
                res.status(200).send({usersIn:team.users, usersOut:users});
                        }
                    }
                })
            }
        }
    }).populate(populateQuery);
}


function getTeam(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getTeam';
    var teamId = req.params.id;

    Team.findById(teamId, (err, team) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!team){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'El equipo no existe'});
            }else{
                res.status(200).send({team});
            }
        }
    }).populate('company');
}

function saveTeam(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'saveTeam';
    var team = new Team();

    var params = req.body;

    team.name = params.name;
    team.default = false;
    team.createDate = moment().format("DD-MM-YYYY HH:mm");
    team.company = params.company;


    team.save((err, teamStored) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'})
        }else{
            if(!teamStored){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'El equipo no ha sido guardado'})
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({team:teamStored})
            }
        }
    });
}

function getTeams(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getTeams';
    var populateQuery = [
        {path:'users', model:'User', select:['name','surname','image']},
        {path:'company',select:['name','email','image','mailSender']}
    ];

    let company = req.params.company


    Team.find({company:company, deleted:false}).sort('name').populate(populateQuery).exec(function(err, teams){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!teams){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay equipos'})
            }else{
                res.status(200).send({
                    teams: teams
                });
            }
        }
    });
}

function getTeamsOfUser(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getTeamsOfUser';
    var id = req.params.id;

    Team.find({users:id}).exec(function(err, teams){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!teams){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay equipos'})
            }else{
                res.status(200).send({teams: teams});
            }
        }
    });
}

function getTeamsForName(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getTeamsForName';
    var populateQuery = [
        {path:'users', model:'User', select:['name','surname','image']},
        {path:'company',select:['name','email','image','mailSender']}
    ];

    let company = req.params.company
    let name = req.params.name

    Team.find({company:company, deleted:false, name:{ "$regex": name, "$options": "i" }}).sort('name').populate(populateQuery).exec(function(err, teams){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!teams){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay equipos'})
            }else{
                res.status(200).send({
                    teams: teams
                });
            }
        }
    });
}

function updateTeam(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'updateTeam';
    var teamId = req.params.id;
    var update =  req.body;

    //teamId = Team buscado, update = datos nuevos a actualizar
    Team.findByIdAndUpdate(teamId, update, (err, teamUpdated) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!teamUpdated){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado el equipo'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({team:teamUpdated});
            }
        }
    });
}

function deleteTeam(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'deleteTeam';
    var teamId = req.params.id;

    Team.findByIdAndUpdate(teamId, {deleted:true}, (err, teamRemoved) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!teamRemoved){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado el equipo'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({team: teamRemoved});
            }
        }
    });
}

function uploadImage(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'uploadImage';
    var teamId = req.params.id;
    var file_name = 'No subido';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('/'); //eliminar y recortar las barras del path
        var file_name = file_split[2]; // [ 'uploads', 'teams', 'pWgu0s-hHBgJl-5w1RSPS5G7.jpg' ]

        var ext_split = file_name.split('\.');
        var file_ext = ext_split [1]; //Comprueba si es un jpg [ 'j5HRZbfL7qgOgp2YRQ3F0ub8', 'jpg' ]

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

            Team.findByIdAndUpdate(teamId, {image: file_name}, (err, teamUpdated) =>{
                if(err){
                    logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error al actualizar el usuario'});
                }else{
                    if(!teamUpdated){
                        logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                    }else{
                      logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({image: file_name, team: teamUpdated});
                    }
                }
            });
        }else{
                      logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({message: 'Extension de archivo no valido'});
        }

        console.log(ext_split);
    }else{
        logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Solicitud de '+req.params.id}});
                res.status(200).send({message: 'No ha subido ninguna imagen'});
    }
}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/teams/'+imageFile;

    fs.exists(pathFile, function(exists){
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(200).send({message: 'No existe la imagen...'});
        }
    });
}

function addUser(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'addUser';
    var teamId = req.params.id;
    var user = req.body.user;

   
    Team.findByIdAndUpdate(
        teamId,
        { $push: {"users": {_id:user}}},
        {  safe: true, upsert: true},
            function(err, team) {
            if(err){
                console.log(err);
                return res.send(err);
            }else{
                logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({team:team});
            }
            });
                
     
     
/*
    var populateQuery = [{path:'teams', select:'team'}];

    User.findByIdAndUpdate(userId, {'$push': {'teams':  mongoose.Types.ObjectId(team._id)}}, { new: true, upsert: true }, (err, userUpdated) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message:'Error en la petición', team, userId});
        }else{
            if(!userUpdated){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message:'El usuario no existe'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({user:userUpdated});
            }
        }
    }).populate(populateQuery);*/
}

function removeUser(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'removeUser';
    var teamId = req.params.id;
    var user = req.body.user;
     
     Team.findByIdAndUpdate(
     teamId,
     { $pull: {"users": user}},
     {  safe: true, upsert: false},
     function(err, team) {
        if(err){
           console.log(err);
           return res.send(err);
        }
         logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Solicitud de '+req.params.id}});
                res.status(200).send({team:team});
     });
}


 
module.exports = {
    getTeam,
    getTeams,
    getTeamsForName,
    getAgentsInTeam,
    getTeamsOfUser,

    saveTeam,
    updateTeam,
    deleteTeam,
    uploadImage,
    getImageFile,

    addUser,
    removeUser
};