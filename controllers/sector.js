var Sector = require('../models/sector');

//Sistema de log
var logger = require('../services/logger');
var jwt_decode = require('jwt-decode');
var path = require('path');


function getSectors(req, res){
    var decoded = jwt_decode(req.headers.authorization);

    var functionName = 'getSectors';

    Sector.find({}, (err, sectors) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!sectors){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'La compañia no existe'});
            }else{
                res.status(200).send({sectors:sectors});
            }
        }
    });
}

function getSector(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getSector';

    Sector.findById(req.params.id, (err, sector) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!sector){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'La compañia no existe'});
            }else{
                res.status(200).send({sector:sector});
            }
        }
    });
}

function getSectorsForName(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var name = req.params.name;
    var functionName = 'getSectorsForName';

    Sector.find({name:{ "$regex": name, "$options": "i" }}, (err, sectors) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!sectors){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'La compañia no existe'});
            }else{
                res.status(200).send({sectors:sectors});
            }
        }
    });
}

function saveSector(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var sector = new Sector();
    var functionName = 'saveSector';

    var params = req.body;

    sector.name = params.name;
    sector.email = params.email;

    sector.save((err, sectorStored) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'})
        }else{
            if(!sectorStored){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'La compañia no ha sido guardado'})
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({sector:sectorStored})
            }
        }
    });
}

function updateSector(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var sectorId = req.params.id;
    var update =  req.body;
    var functionName = 'updateSector';

    //sectorId = sector buscado, update = datos nuevos a actualizar
    Sector.findByIdAndUpdate(sectorId, update, (err, sectorUpdated) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!sectorUpdated){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado La compañia'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({sector:sectorUpdated});
            }
        }
    });
}

function deleteSector(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var sectorId = req.params.id;
    var functionName = 'deleteSector';

    Sector.findByIdAndDelete(sectorId, (err, sectorRemoved) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!sectorRemoved){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado La compañia'});
            }else{
                logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({sector: sectorRemoved});
            }
        }
    });
}


module.exports = {
    getSector,
    getSectors,
    getSectorsForName,

    saveSector,
    updateSector,
    deleteSector,

};