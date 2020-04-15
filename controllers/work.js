'use strict'
var Work = require('../models/work');

//Sistema de log
var logger = require('../services/logger');
var jwt_decode = require('jwt-decode');var path = require('path');

//Control de tiempo
const moment = require('moment');

function getOne(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getOne';
    var workId = req.params.id;
    var populateQuery = [
        {path:'createdBy',select:['name','surname','image']},
        {path:'userWork',select:['name','surname','image']},
        {path:'teamWork',select:['name','image']},
    ];
    Work.findById(workId, (err, work) =>{
        if(err){
            logger.error({work:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({work: 'Error del servidor en la peticion'});
        }else{
            if(!work){
                logger.warn({work:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({work: 'La tarea no existe'});
            }else{
                res.status(200).send({work});
            }
        }
    }).populate(populateQuery);
}

function save(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'save';
    var work = new Work();
    var params = req.body;

    work.name = params.text;
    work.desc = params.chat;
    work.createdBy = params.createdBy;
    work.userWork = params.userWork;
    work.teamWork = params.teamWork;
    work.dateCreated = moment().locale('es').format("YY-MMM-DD HH:mm");
    work.dateWork = params.dateWork;
    work.dateLimit = params.dateLimit;
    work.tag = params.tag;
    work.editable = params.editable;
    work.status = params.status;
    work.priority = params.priority;


    work.save((err, workStored) =>{
        if(err){
            logger.error({work:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({work: err})
        }else{
            if(!workStored){
                logger.warn({work:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
            res.status(404).send({work: 'La tarea no ha sido guardado'})
            }else{
                logger.info({work:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({work:workStored})
            }
        }
    });
}


function getList(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getList';
    var populateQuery = [
        {path:'createdBy',select:['name','surname','image']},
        {path:'userWork',select:['name','surname','image']},
        {path:'teamWork',select:['name','image']},
    ];

    Work.find({}).sort('dateCreated').populate(populateQuery).exec(function(err, works){
        if(err){
            logger.error({work:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({work: 'Error del servidor en la peticion'})
        }else{
            if(!works){
                logger.warn({work:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({work: 'No hay works'})
            }else{
                res.status(200).send({works: works});
            }
        }
    });
}

function update(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'update';
    var workId = req.params.id;
    var update =  req.body;

    //workId = work buscado, update = datos nuevos a actualizar
    Work.findByIdAndUpdate(workId, update, (err, workUpdated) =>{
        if(err){
            logger.error({work:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({work: 'Error del servidor en la petición'});
        }else{
            if(!workUpdated){
                logger.warn({work:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({work: 'No se ha encontrado La tarea'});
            }else{
              logger.info({work:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({work:workUpdated});
            }
        }
    });
}    

function remove(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'remove';
    var workId = req.params.id;

    Work.findByIdAndRemove(workId, (err, workRemoved) =>{
        if(err){
            logger.error({work:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({work: 'Error en la petición'});
        }else{
            if(!workRemoved){
                logger.warn({work:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({work: 'No se ha encontrado La tarea'});
            }else{
                logger.info({work:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({work: workRemoved});
            }
        }
    });
}

module.exports = {
    getOne,
    getList,

    save,
    update,
    remove
};