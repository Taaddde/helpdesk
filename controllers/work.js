'use strict'
var Work = require('../models/work');
var Team = require('../models/team');

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
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({work: 'Error del servidor en la peticion'});
        }else{
            if(!work){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
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
        var works = new Array();

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
                workToSave = saveWork(workParam, now.format('YYYY-MM-DD')).then( data =>{
                     data.save((err, workStored) => {
                        if(err){
                            console.log('Hubo un error al crear una tarea')
                        }else{
                            works.push(workStored._id);
                        }
                    });
                });    
            }

            now.add(1, 'day');
        }
        res.status(200).send({work:works})



    }else{
        //UNA VEZ
        let workToSend;
        work.name = workParam.name;
        work.desc = workParam.desc;
        work.createdBy = workParam.createdBy;
        work.userWork = workParam.userWork;
        work.teamWork = workParam.teamWork;
        work.dateCreated = moment().locale('es').format("YYYY-MMM-DD HH:mm");
        work.dateWork = workParam.dateWork;
        work.dateLimit = workParam.dateLimit;
        work.tag = workParam.tag;
        work.editable = workParam.editable;
        work.status = workParam.status;
        work.free = workParam.free;
        work.priority = workParam.priority;
    
    
        work.save((err, workStored) =>{
            if(err){
                console.log(err)
                logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({work: err})
            }else{
                if(!workStored){
                    logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                    res.status(404).send({work: 'La tarea no ha sido guardado'})
                }else{
                    logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
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
    Work.find({status:{$ne:'Finalizado'},userWork:ObjectId(id)}).sort('dateCreated').populate(populateQuery).exec(function(err, works){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({work: 'Error del servidor en la peticion'})
        }else{
            if(!works){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
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
    Work.find({status:{$eq:'Finalizado'},userWork:ObjectId(id)}).sort('dateCreated').populate(populateQuery).exec(function(err, works){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({work: 'Error del servidor en la peticion'})
        }else{
            if(!works){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({work: 'No hay works'})
            }else{
                res.status(200).send({works: works});
            }
        }
    });
}

function getFreeList(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getList';
    var userId = req.params.id;


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
                    {path:'createdBy',select:['name','surname','image']},
                    {path:'userWork',select:['name','surname','image']},
                    {path:'teamWork',select:['name','image']},
                ];

                Work.find({teamWork:teams, $or:[{userWork:null}, {userWork:undefined}]}).sort('dateCreated').populate(populateQuery).exec(function(err, works){
                    if(err){
                        logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                            res.status(500).send({work: 'Error del servidor en la peticion'})
                    }else{
                        if(!works){
                            logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                            res.status(404).send({work: 'No hay works'})
                        }else{
                            res.status(200).send({works: works});
                        }
                    }
                });

            }
        }
    });



}


function getDateWork(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getDateWork';
    let userId = req.params.id

    let query =[
        // First Stage
        {
          $match : {  userWork: ObjectId(userId), status:{$ne:'Finalizada'} }
        },
        // Second Stage
        {
          $project : {
             _id : 1,
             dateLimit:1,
             name:1
            },
        },
       ]

    Work.aggregate(query, (err, works) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion',err:err});
        }else{
            if(!works){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'El ticket no existe'});
            }else{
                res.status(200).send({works:works});
            }
        }
    });
}

function getListPaged(req, res){
    var functionName = 'getListPaged';
    var decoded = jwt_decode(req.headers.authorization);
    var populateQuery = [
        {path:'teamWork',select:['name','image']},
        {path:'userWork',select:['name','surname','image']}, 
        {path:'createdBy',select:['name','surname','image']}, 
    ];

    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;
    }
    var perPage = req.params.perPage;


    var query = req.query;
    var sort = {dateCreated:-1}
    var _ids;
    var userId = req.params.userId;



    //Parche por errores del http
    if(query['name']){
        query['name'] = { "$regex": query['name'], "$options": "i" }
    }

    if(query['tag']){
        query['tag'] = { "$regex": query['tag'], "$options": "i" }
    }

    if(query['free'] == 'true'){
        Team.find({users:userId}).exec(function(err, teams){
            if(err){
                logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
            }else{
                if(!teams){
                    logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                    res.status(404).send({message: 'No hay tickets'})
                }else{
                    query['teamWork'] = {$in:teams};
                    Work.paginate(query,{page:page, limit:perPage, populate:populateQuery, sort:sort}, function(err, works){
                        if(err){
                            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                            console.log(err)
                            res.status(500).send({message: err})
                        }else{
                            if(!works){
                                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                                res.status(404).send({message: 'No hay items'})
                            }else{
                                res.status(200).send({works:works});
                            }
                        }
                    });
                }
            }
        });    
    }else{
        Work.paginate(query,{page:page, limit:perPage, populate:populateQuery, sort:sort}, function(err, works){
            if(err){
                logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                console.log(err)
                res.status(500).send({message: err})
            }else{
                if(!works){
                    logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                    res.status(404).send({message: 'No hay items'})
                }else{
                    res.status(200).send({works:works});
                }
            }
        });    
    }

}

function update(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'update';
    var workId = req.params.id;
    var update =  req.body;

    //workId = work buscado, update = datos nuevos a actualizar
    Work.findByIdAndUpdate(workId, update, (err, workUpdated) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({work: 'Error del servidor en la petición'});
        }else{
            if(!workUpdated){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({work: 'No se ha encontrado La tarea'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
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
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({work: 'Error en la petición'});
        }else{
            if(!workRemoved){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({work: 'No se ha encontrado La tarea'});
            }else{
                logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({work: workRemoved});
            }
        }
    });
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
        
                Work.findByIdAndUpdate(wo, {$push: {files: file_name}}, (err, workUpdated) =>{
                    if(err){
                        logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                        res.status(500).send({message: 'Error al actualizar el usuario'});
                    }else{
                        if(!workUpdated){
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
            Work.findByIdAndUpdate(wo, {$push: {files: file_name}}, (err, workUpdated) =>{
                if(err){
                    logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                    res.status(500).send({message: 'Error al actualizar el usuario'});
                }else{
                    if(!workUpdated){
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

function getCountWorks(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getCountWorks';

    let userId = req.params.id;

    Work.countDocuments({userWork: userId,status:{$ne:'Libre'},status:{$ne:'Finalizado'}}, function(err, c){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!c){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay items'})
            }else{
                res.status(200).send({count:c})
            }
        }
    })
}

function getCountFreeWorks(req,res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getCountFreeWorks';
    var userId = req.params.id;

    Team.find({users:userId}).exec(function(err, teams){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!teams){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay tickets'})
            }else{
                Work.countDocuments({teamWork:teams, $or:[{userWork:null}, {userWork:undefined}]}, function(err, count) {
                    if(err){
                        logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                        res.status(500).send({work: 'Error en la petición'});
                    }else{
                        res.status(200).send({count:count});
                    }
                })
            }
        }
    });
    
}

module.exports = {
    getOne,
    getList,
    getFinishList,
    getFreeList,
    getDateWork,
    getListPaged,

    getCountFreeWorks,
    getCountWorks,


    uploadFile,
    getFile,

    save,
    update,
    remove
};