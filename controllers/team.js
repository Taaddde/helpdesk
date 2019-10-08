'use strict'

var Team = require('../models/team');
//Sistema de ficheros
var fs = require('fs');
var path = require('path');

function getTeam(req, res){
    var teamId = req.params.id;

    Team.findById(teamId, (err, team) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!team){
                res.status(404).send({message: 'El equipo no existe'});
            }else{
                res.status(200).send({team});
            }
        }
    });
}

function saveTeam(req, res){
    var team = new Team();

    var params = req.body;

    team.name = params.name;
    team.default = false;

    team.save((err, teamStored) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la petición'})
        }else{
            if(!teamStored){
                res.status(404).send({message: 'El equipo no ha sido guardado'})
            }else{
                res.status(200).send({team:teamStored})
            }
        }
    });
}


function getTeams(req, res){
    Team.find({}).sort('name').exec(function(err, teams){
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!teams){
                res.status(404).send({message: 'No hay equipos'})
            }else{
                return res.status(200).send({
                    teams: teams
                });
            }
        }
    });
}

function updateTeam(req, res){
    var teamId = req.params.id;
    var update =  req.body;

    //teamId = Team buscado, update = datos nuevos a actualizar
    Team.findByIdAndUpdate(teamId, update, (err, teamUpdated) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!teamUpdated){
                res.status(404).send({message: 'No se ha encontrado el equipo'});
            }else{
                res.status(200).send({team:teamUpdated});
            }
        }
    });
}

function deleteTeam(req, res){
    var teamId = req.params.id;

    Team.findByIdAndDelete(teamId, (err, teamRemoved) =>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!teamRemoved){
                res.status(404).send({message: 'No se ha encontrado el equipo'});
            }else{
                res.status(200).send({team: teamRemoved});
            }
        }
    });
}

function uploadImage(req, res){
    var teamId = req.params.id;
    var file_name = 'No subido';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\'); //eliminar y recortar las barras del path
        var file_name = file_split[2]; // [ 'uploads', 'teams', 'pWgu0s-hHBgJl-5w1RSPS5G7.jpg' ]

        var ext_split = file_name.split('\.');
        var file_ext = ext_split [1]; //Comprueba si es un jpg [ 'j5HRZbfL7qgOgp2YRQ3F0ub8', 'jpg' ]

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

            Team.findByIdAndUpdate(teamId, {image: file_name}, (err, teamUpdated) =>{
                if(err){
                    res.status(500).send({message: 'Error al actualizar el usuario'});
                }else{
                    if(!teamUpdated){
                        res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                    }else{
                        res.status(200).send({image: file_name, team: teamUpdated});
                    }
                }
            });
        }else{
            res.status(200).send({message: 'Extension de archivo no valido'});
        }

        console.log(ext_split);
    }else{
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


 
module.exports = {
    getTeam,
    saveTeam,
    getTeams,
    updateTeam,
    deleteTeam,
    uploadImage,
    getImageFile
};