'use strict'
var WorkObservation = require('../models/workobservation');
var moment = require('moment');
//Sistema de ficheros
var fs = require('fs');
var path = require('path');

const mongoose =require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

//Sistema de log
var logger = require('../services/logger');
var jwt_decode = require('jwt-decode');

function getOne(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getOne';
    var populateQuery = [
        {path:'user', select:['name','surname','image']},
    ];

    var id = req.params.id;

    WorkObservation.findById(id, (err, workObservation) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!workObservation){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'El bloque de texto no existe'});
            }else{
                res.status(200).send({workObservation});
            }
        }
    }).populate(populateQuery);
}

function save(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'save';
    
    var workObservation = new WorkObservation();
    var params = req.body;

    workObservation.text = params.text;
    workObservation.user = params.user;
    workObservation.work = params.work;
    workObservation.read = params.read;
    workObservation.date = moment().format("YYYY-MM-DD HH:mm");

    workObservation.save((err, workObservationStored) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'})
        }else{
            if(!workObservationStored){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'El bloque de texto no ha sido guardado'})
            }else{
              //logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({workObservation:workObservationStored})
            }
        }
    });
}

function getListForId(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getListForId';
    var work = req.params.id;

    var populateQuery = [
        {path:'user', select:['name','surname','image']},
    ];


    let query = {work:ObjectId(work)};
    WorkObservation.find(query).populate(populateQuery).sort('date').exec(function(err, workObservations){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!workObservations){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay bloque de textos'})
            }else{
                res.status(200).send({
                    workObservations: workObservations
                });
            }
        }
    });
}

function update(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'update';
    var id = req.params.id;
    var update =  req.body;
    //id = workObservation buscado, update = datos nuevos a actualizar
    WorkObservation.findByIdAndUpdate(id, update, (err, workObservationUpdated) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!workObservationUpdated){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado El bloque de texto'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({workObservation:workObservationUpdated});
            }
        }
    });
}

function read(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'read';
    var work = req.params.id;
    var update =  req.body;

    //id = workObservation buscado, update = datos nuevos a actualizar
    WorkObservation.updateMany({work:ObjectId(work)}, update, (err, workObservationUpdated) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!workObservationUpdated){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado El bloque de texto'});
            }else{
                res.status(200).send({workObservation:workObservationUpdated});
            }
        }
    });
}


function remove(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'remove';
    var id = req.params.id;

    WorkObservation.findByIdAndDelete(id, (err, workObservationRemoved) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!workObservationRemoved){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado El bloque de texto'});
            }else{
                logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({workObservation: workObservationRemoved});

                if(workObservationRemoved.files){
                    workObservationRemoved.files.forEach(e => {
                        fs.unlink('../helpdesk/uploads/attachs/'+e, function (err) {
                            if (err) console.log(err);
                        });
                    });    
                }
            }
        }
    });
}

function uploadFiles(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'uploadFile';
    var wo = req.params.id;
    var file_name = 'No subido';
    if(req.files){
            var file_path = req.files.file.path;
            var file_split = file_path.split('\\'); //eliminar y recortar las barras del path
            var file_name = file_split[2]; // [ 'uploads', 'users', 'pWgu0s-hHBgJl-5w1RSPS5G7.jpg' ]
    
            var ext_split = file_name.split('\.');
            var file_ext = ext_split [1]; //Comprueba si es un jpg [ 'j5HRZbfL7qgOgp2YRQ3F0ub8', 'jpg' ]
    
            WorkObservation.findByIdAndUpdate(wo, {$push: {files: file_name}}, (err, workObservationUpdated) =>{
                if(err){
                    logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                    res.status(500).send({message: 'Error al actualizar el usuario'});
                }else{
                    if(!workObservationUpdated){
                        logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                        res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                    }else{
                        logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                        res.status(200).send({order: workObservationUpdated});
                    }
                }
            });
     
    }else{
        res.status(400).send({message: 'No ha subido ninguna imagen'});
    }
}

async function uploadFile(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'uploadFile';
    var wo = req.params.id;
    var file_name = 'No subido';

    if(req.files && req.files.file){
        if(req.files.file.length > 1){
            req.files.file.forEach(async e => {
                var file_path = e.path;
                var file_split = file_path.split('\\'); //eliminar y recortar las barras del path
                var file_name = file_split[2]; // [ 'uploads', 'users', 'pWgu0s-hHBgJl-5w1RSPS5G7.jpg' ]
        
                var ext_split = file_name.split('\.');
                var file_ext = ext_split [1]; //Comprueba si es un jpg [ 'j5HRZbfL7qgOgp2YRQ3F0ub8', 'jpg' ]
        
                WorkObservation.findByIdAndUpdate(wo, {$push: {files: file_name}}, (err, workObservationUpdated) =>{
                    if(err){
                        logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                        res.status(500).send({message: 'Error al actualizar el usuario'});
                    }else{
                        if(!workObservationUpdated){
                            logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                            res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                        }
                    }
                });
            });    
        }else{
            var file_path = req.files.file.path;
            var file_split = file_path.split('\\'); //eliminar y recortar las barras del path
            var file_name = file_split[2]; // [ 'uploads', 'users', 'pWgu0s-hHBgJl-5w1RSPS5G7.jpg' ]
    
            var ext_split = file_name.split('\.');
            var file_ext = ext_split [1]; //Comprueba si es un jpg [ 'j5HRZbfL7qgOgp2YRQ3F0ub8', 'jpg' ]
            WorkObservation.findByIdAndUpdate(wo, {$push: {files: file_name}}, (err, workObservationUpdated) =>{
                if(err){
                    logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                    res.status(500).send({message: 'Error al actualizar el usuario'});
                }else{
                    if(!workObservationUpdated){
                        logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                        res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                    }
                }
            });
        }
        logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
        res.status(200).send({message:'Adjuntos subidos correctamente'});
    }else{
        res.status(400).send({message: 'No ha subido ninguna imagen'});
    }
}

function getFile(req, res){
    var file = req.params.fileName;
    var pathFile = './uploads/attachs/'+file;

    fs.exists(pathFile, function(exists){
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(200).send({message: 'No existe el archivo...'});
        }
    });
}


module.exports = {
    getOne,
    getListForId,

    save,
    update,
    remove,
    read,

    uploadFile,
    getFile,
};