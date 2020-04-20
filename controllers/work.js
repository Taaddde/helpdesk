'use strict'
var Work = require('../models/work');

//Sistema de log
var logger = require('../services/logger');
var jwt_decode = require('jwt-decode');var path = require('path');

//Control de tiempo
const moment = require('moment');

const mongoose =require('mongoose')

const ObjectId = mongoose.Types.ObjectId;


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
    });
}

function save(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'save';
    var work = new Work();
    var params = req.body;
    var workParam = params[0];

    if(params[1] == 'true'){
        //REPETIR
        //DIA DE HOY
        let now = moment();
        let repeatParams = params[2];
        let daysRepeat = [];
        let limitDay = workParam.dateLimit;

        if(repeatParams['lun']){
            daysRepeat.push(1);
        }
        if(repeatParams['mar']){
            daysRepeat.push(2);
        }
        if(repeatParams['mie']){
            daysRepeat.push(3);
        }
        if(repeatParams['jue']){
            daysRepeat.push(4);
        }
        if(repeatParams['vie']){
            daysRepeat.push(5);
        }
        if(repeatParams['sab']){
            daysRepeat.push(6);
        }
        
        if(!daysRepeat.includes(now.weekday())){
            //Buscar primer día
            now.add(1, 'day');
            while (!daysRepeat.includes(now.weekday())) {
                now.add(1, 'day');
            }
        }

        var workToSave = new Work();
        while (now.isBefore(limitDay)) {

            if(daysRepeat.includes(now.weekday())){
                workToSave = saveWork(workParam, now.format('YYYY-MM-DD')).then(async data =>{
                    await data.save((err, workStored) => {
                        if(err){
                            console.log('Hubo un error al crear una tarea')
                        }else{
                            console.log('Se generó la tarea ');
                        }
                    });
                });    
            }

            now.add(1, 'day');
        }


        console.log(now.daysInMonth());
        res.status(200).send({work:true})


    }else{
        //UNA VEZ
        work.name = workParam.name;
        work.desc = workParam.desc;
        work.createdBy = workParam.createdBy;
        work.userWork = workParam.userWork;
        work.teamWork = workParam.teamWork;
        work.dateCreated = moment().locale('es').format("YY-MMM-DD HH:mm");
        work.dateWork = workParam.dateWork;
        work.dateLimit = workParam.dateLimit;
        work.tag = workParam.tag;
        work.editable = workParam.editable;
        work.status = workParam.status;
        work.priority = workParam.priority;
    
    
        work.save((err, workStored) =>{
            if(err){
                console.log(err)
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

}


async function saveWork(e, dateWork){
    let work = new Work;

    work.name = e['name'];
    work.desc = e['desc'];
    work.createdBy = e['createdBy'];
    work.userWork = e['userWork'];
    work.teamWork = e['teamWork'];
    work.dateCreated = moment().locale('es').format("YY-MMM-DD HH:mm");
    work.dateWork = dateWork;
    work.dateLimit = e['dateLimit'];
    work.tag = e['tag'];
    work.editable = e['editable'];
    work.status = e['status'];
    work.priority = e['priority'];

    return work;
}


function getList(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getList';
    var id = req.params.id;
    var populateQuery = [
        {path:'createdBy',select:['name','surname','image']},
        {path:'userWork',select:['name','surname','image']},
        {path:'teamWork',select:['name','image']},
    ];
    // poner userWork:ObjectId(id)
    Work.find({status:{$ne:'Finalizado'}}).sort('dateCreated').populate(populateQuery).exec(function(err, works){
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

function getFinishList(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getList';
    var id = req.params.id;
    var populateQuery = [
        {path:'createdBy',select:['name','surname','image']},
        {path:'userWork',select:['name','surname','image']},
        {path:'teamWork',select:['name','image']},
    ];
    // poner userWork:ObjectId(id)
    Work.find({status:{$eq:'Finalizado'}}).sort('dateCreated').populate(populateQuery).exec(function(err, works){
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
    getFinishList,

    save,
    update,
    remove
};