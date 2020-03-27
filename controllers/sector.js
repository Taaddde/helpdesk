var Sector = require('../models/sector');
var User = require('../models/user');

//Sistema de log
var logger = require('../services/logger');
var jwt_decode = require('jwt-decode');
var path = require('path');
const mongoose =require('mongoose')

const ObjectId = mongoose.Types.ObjectId;


function getSectors(req, res){
    var decoded = jwt_decode(req.headers.authorization);

    var functionName = 'getSectors';


    Sector.find({}).sort('name').exec((err, sectors) =>{
        if(err){
            //logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!sectors){
                //logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'La compañia no existe'});
            }else{
                res.status(200).send({sectors:sectors});
            }
        }
    });
}

function getCount(id){
    User.countDocuments({sector:id}, (err, count) => {
        if(err){
            console.log(err);
        }else{
            //console.log(count)
            return count;
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
    sector.initials = params.initials;
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

function getListPaged(req, res){
    var functionName = 'getListPaged';
    var decoded = jwt_decode(req.headers.authorization);

    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;
    }

    var perPage = req.params.perPage;

    var sort = {name:1}

    Sector.paginate({},{page:page, limit:perPage, sort:sort}, function(err, sectors){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            console.log(err)
            res.status(500).send({message: err})
        }else{
            if(!sectors){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay items'})
            }else{
                res.status(200).send({
                    sectors:sectors
                });
            }
        }
    });
}


module.exports = {
    getSector,
    getSectors,
    getSectorsForName,
    getListPaged,

    saveSector,
    updateSector,
    deleteSector,
};