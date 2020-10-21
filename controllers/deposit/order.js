'use strict'
var Order = require('../../models/deposit/order');

//Sistema de log
var logger = require('../../services/logger');
var jwt_decode = require('jwt-decode');var path = require('path');


//Sistema de print
const createHTML = require('create-html');
const pdf = require('html-pdf');
var fs = require('fs');
var path = require('path');

var populateQuery = [
    {path:'company',select:['name']},
];

function getOne(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getOne';
    var id = req.params.id;

    Order.findById(id, (err, one) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!one){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'La etiqueta no existe'});
            }else{
                logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({order:one});
            }
        }
    }).populate(populateQuery);
}

function save(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'save';
    var order = new Order();

    var params = req.body;

    Order.countDocuments({}, function(err, count) {
        order.numOrder = count+1;
        order.status = params.status;
        order.date = params.date;
        order.dateRequired = params.dateRequired;
        order.company = params.company;
        order.sectorDestiny = params.sectorDestiny;
        order.justification = params.justification;
        order.obs = params.obs;
        order.uploadDate = new Date();

        order.save((err, stored) =>{
            if(err){
                console.log(err);
                logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                    res.status(500).send({message: 'Error del servidor en la petición'})
            }else{
                if(!stored){
                    logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                    res.status(404).send({message: 'La etiqueta no ha sido guardado'})
                }else{
                    logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                    res.status(200).send({order:stored})
                }
            }
        });
    })
    
}

async function print(req, res){
    var id = req.params.id;
    var body = req.body.body;


    var htmlCreated = createHTML({
        scriptAsync: true,
        head: '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"> <style>.cell{color: rgb(0,0,0);font-size: 12px;}.card::after {content: "";background: url(https://upload.wikimedia.org/wikipedia/commons/7/7d/Sanatorio_Mar%C3%ADtimo_de_Vi%C3%B1a_del_Mar.svg) no-repeat;opacity: 0.1;top: 0;left: 0;bottom: 0;right: 0;position: absolute;z-index: 1;height: 100%;width: 100%;margin: 20px;}</style>',
        body: body,
    })
    
    let dir = path.join(__dirname, '../../uploads/html/'+id+'.html');

    fs.writeFile(dir, htmlCreated, function (err) {
        if (err) console.log(err)
    })

    let dirPdf = path.join(__dirname, '../../uploads/orders/'+id+'.pdf');
    var options = { 
        format: 'A4',
        orientation: "landscape",
    };

    await pdf.create(htmlCreated, options).toStream(function(err, stream){
        if(err){console.log(err)}
        stream.pipe(fs.createWriteStream(dirPdf));
    });

    res.status(200).send({done: true});

}


function getList(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getList';
    var query = req.query;

    Order.find(query).populate(populateQuery).sort({numOrder: -1}).exec(function(err, list){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!list){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay etiquetas'})
            }else{
                logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({orders: list});
            }
        }
    });
}

function update(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'update';
    var id = req.params.id;
    var update =  req.body;

    //id = order buscado, update = datos nuevos a actualizar

    Order.findByIdAndUpdate(id, update, (err, updated) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!updated){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado La etiqueta'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
              res.status(200).send({order:updated});
            }
        }
    });
}

function remove(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'remove';
    var id = req.params.id;

    Order.findByIdAndDelete(id, (err, removed) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!removed){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado La etiqueta'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({order: removed});
            }
        }
    });
}

function getPrint(req, res){
    var id = req.params.id;
    var pathFile = './uploads/orders/'+id+'.pdf';


    fs.exists(pathFile, function(exists){
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(200).send({message: 'No existe la imagen...'});
        }
    });
}


module.exports = {
    getOne,
    getList,
    print,
    getPrint,

    save,
    update,
    remove,
};