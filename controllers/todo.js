'use strict'
var Todo = require('../models/todo');

//Sistema de log
var logger = require('../services/logger');
var jwt_decode = require('jwt-decode');var path = require('path');

var populateQuery = [
    {path:'tags', model:'Tag', select:['name']},
    {path:'users', model:'User', select:['name','surname','image']},
    {path:'team', select:['name','image', 'users'], populate:{path: 'users', model: 'User',select:['name','surname','image']}},

];

function getOne(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getOne';
    var id = req.params.id;

    Todo.findById(id, (err, one) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!one){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'La etiqueta no existe'});
            }else{
                logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({todo:one});
            }
        }
    }).populate(populateQuery);
}

function save(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'save';
    var todo = new Todo();

    var params = req.body;

    todo.title = params.title;
    todo.note = params.note;
    todo.important = params.important;
    todo.starred = params.starred;
    todo.done = params.done;
    todo.read = params.read;
    todo.selected = params.selected;
    todo.startDate = params.startDate;
    todo.dueDate = params.dueDate;
    todo.tags = params.tags;
    todo.team = params.team;
    todo.users = params.users;

    todo.save((err, stored) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'})
        }else{
            if(!stored){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'La etiqueta no ha sido guardado'})
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({todo:stored})
            }
        }
    });
}


function getList(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getList';
    var query = req.query;

    Todo.find(query).populate(populateQuery).sort('title').exec(function(err, list){
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
                    todos: list
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

    Todo.findByIdAndUpdate(id, update, (err, updated) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!updated){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado La etiqueta'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
              res.status(200).send({todo:updated});
            }
        }
    });
}

function remove(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'remove';
    var id = req.params.id;

    Todo.findByIdAndDelete(id, (err, removed) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!removed){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado La etiqueta'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({todo: removed});
            }
        }
    });
}


function addTag(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'addTag';
    var id = req.params.id;
    var tag = req.body.tag;
    
    Todo.findByIdAndUpdate(
        id,
        { $push: {"tags": {_id:tag}}},
        {  safe: true, upsert: true},
            function(err, todo) {
            if(err){
                console.log(err);
                return res.send(err);
            }else{
                logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({todo:todo});
            }
    });
}
    
function removeTag(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'removeTag';
    var id = req.params.id;
    var tag = req.body.tag;
        
        Todo.findByIdAndUpdate(
        id,
        { $pull: {"tags": tag}},
        {  safe: true, upsert: false},
        function(err, todo) {
        if(err){
            console.log(err);
            return res.send(err);
        }
            logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Solicitud de '+req.params.id}});
                res.status(200).send({todo:todo});
        });
}

function addUser(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'addUser';
    var id = req.params.id;
    var user = req.body.tag;
    
    Todo.findByIdAndUpdate(
        id,
        { $push: {"users": {_id:user}}},
        {  safe: true, upsert: true},
            function(err, todo) {
            if(err){
                console.log(err);
                return res.send(err);
            }else{
                logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({todo:todo});
            }
    });
}
    
function removeUser(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'removeUser';
    var id = req.params.id;
    var user = req.body.user;
        
        Todo.findByIdAndUpdate(
        id,
        { $pull: {"users": user}},
        {  safe: true, upsert: false},
        function(err, todo) {
        if(err){
            console.log(err);
            return res.send(err);
        }
            logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Solicitud de '+req.params.id}});
                res.status(200).send({todo:todo});
        });
}

    

module.exports = {
    getOne,
    getList,

    save,
    update,
    remove,

    addTag,
    removeTag,
    
    addUser,
    removeUser,
};