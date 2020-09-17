'use strict'
var Movim = require('../../models/deposit/movim');

//Sistema de log
var logger = require('../../services/logger');
var jwt_decode = require('jwt-decode');var path = require('path');

var populateQuery = [
    {path:'depositDestiny',select:['name']},
    {path:'item',select:['name']},
    {path:'agent',select:['name','surname','image']},
    {path:'requester',select:['name','surname','image']},
    {path:'sector',select:['name']},
    {path:'deposit',select:['name']},
    {path:'ticket',select:['numTicket']},

];

function getOne(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getOne';
    var id = req.params.id;

    Movim.findById(id, (err, one) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!one){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'La etiqueta no existe'});
            }else{
                logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({movim:one});
            }
        }
    }).populate(populateQuery);
}

function save(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'save';
    var movim = new Movim();

    var params = req.body;
    Movim.countDocuments({}, function(err, count) {
        movim.numMovim = count+1;
        movim.type = params.type;
        movim.stock = params.stock;
        movim.cant = params.cant;
        movim.agent = params.agent;
        movim.reason = params.reason;
        movim.date = params.date;
        movim.uploadDate = params.uploadDate;
        movim.sector = params.sector;
        movim.requester = params.requester;
        movim.deposit = params.deposit;
    });
    

    movim.save((err, stored) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'})
        }else{
            if(!stored){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'La etiqueta no ha sido guardado'})
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({movim:stored})
            }
        }
    });
}


function getList(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getList';
    var query = req.query;

    Movim.find(query).populate(populateQuery).sort('date').exec(function(err, list){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!list){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay etiquetas'})
            }else{
                logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({
                    movims: list
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

    //id = movim buscado, update = datos nuevos a actualizar

    Movim.findByIdAndUpdate(id, update, (err, updated) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!updated){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado La etiqueta'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
              res.status(200).send({movim:updated});
            }
        }
    });
}

function remove(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'remove';
    var id = req.params.id;

    Movim.findByIdAndDelete(id, (err, removed) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!removed){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado La etiqueta'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({movim: removed});
            }
        }
    });
}

module.exports = {
    getOne,
    getList,

    save,
    update,
    remove,
};