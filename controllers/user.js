'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');
//Sistema de ficheros
var fs = require('fs');
var path = require('path');

//Sistema de log
var logger = require('../services/logger');
var jwt_decode = require('jwt-decode');

//Sistema de expiración
const moment = require('moment');

//Sistema de mails
const mail = require('../services/mail')


const mongoose =require('mongoose')

const ObjectId = mongoose.Types.ObjectId;


function saveUser(req, res){
    var user = new User();
    var functionName = 'saveUser';


    var params = req.body;
    user.num = params.num;
    user.name = params.name;
    user.surname = params.surname;
    user.dni = params.dni;
    user.userName = params.userName;
    user.email = params.email;
    user.phone = params.phone;
    user.sign = params.sign;
    user.role = params.role;
    user.image = 'null';
    user.company = params.company;
    user.receiveMail = params.receiveMail;
    user.sectorRef = params.sectorRef;
    user.sector = params.sector;
    user.infoView = params.infoView;
    user.approved = true;

    User.findOne({userName:user.userName}, (err, userCheck) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: params.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: err});
            console.log(err)
        }else{
            if(!userCheck){
                if(params.password){
                    //encriptar y guardar
                    bcrypt.hash(params.password, null, null, function(err, hash){
                        
                        if(user.name != null && user.surname != null && user.email != null){
                            user.password = hash;
                            //Guardar user
                            user.save((err, userStore) => {
                                if(err){
                                    logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: params.userName+' ('+req.ip+') '+err}});
                                    res.status(500).send({message:err});
                                    console.log(err)
                                }else{
                                   if(!userStore){
                                    logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: params.userName+' ('+req.ip+') Objeto no encontrado'}});
                                    res.status(404).send({message:'No se ha encontrado el usuario'});
                                   }else{
                                  logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: params.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                                    res.status(200).send({user:userStore});
                                   }
                                }
                            });
                        }else{
                            res.status(400).send({message:'Rellena los campos'});
                        }
                    });
                }else{
                    user.save((err, userStore) => {
                        if(err){
                            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: params.userName+' ('+req.ip+') '+err}});
                            res.status(500).send({message:'Error en el servidor al guardar el usuario'});
                        }else{
                           if(!userStore){
                            logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: params.userName+' ('+req.ip+') Objeto no encontrado'}});
                            res.status(404).send({message:'No se ha encontrado el usuario'});
                           }else{
                          logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: params.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                            res.status(200).send({user:userStore});
                           }
                        }
                    });
                }            
            }else{
                logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: params.userName+' ('+req.ip+') Nombre de usuario no disponible'}});
                res.status(400).send({message: 'Nombre de usuario no disponible'});
            }
        }
    });
}

function updateUser(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var userId = req.params.id;
    var functionName = 'updateUser';
    var update = req.body;

    var populateQuery = [
        {path:'company',select:['name','email','image','mailSender']},
        {path:'sector',select:['name','email']}
    ];

    User.findOne({_id: ObjectId(userId),userName:update.userName}, (err, userCheck) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error en el servidor al actualizar el usuario'});
        }else{
            if(userCheck){
                if(update.password && update.password != ''){
                    //encriptar y guardar
                    bcrypt.hash(update.password, null, null, function(err, hash){
                           req.body.password = hash;
                            //Guardar user
                            User.findByIdAndUpdate(userId, update, (err, userUpdated) =>{
                                if(err){
                                    logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                                    res.status(500).send({message: 'Error en el servidor al actualizar el usuario'});
                                }else{
                                    if(!userUpdated){
                                        logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                                        res.status(404).send({message: 'No se ha podido encontrado el usuario'});
                                    }else{
                                      logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                                        res.status(200).send({user: userUpdated});
                                    }
                                }
                            }).populate(populateQuery);
                    });
                }else{
                    User.findByIdAndUpdate(userId, update, (err, userUpdated) =>{
                        if(err){
                            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                            res.status(500).send({message: 'Error en el servidor al actualizar el usuario'});
                        }else{
                            if(!userUpdated){
                                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                            res.status(404).send({message: 'No se ha podido encontrar el usuario'});
                            }else{
                              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                            res.status(200).send({user: userUpdated,message: 'actualizado sin pasar por bcrypt'});
                            }
                        }
                    }).populate(populateQuery);
                }            
            }else{
                User.findOne({userName:update.userName}, (err, userNameCheck) =>{
                    if(err){
                        logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                        res.status(500).send({message: 'Error en el servidor al actualizar el usuario'});
                    }else{
                        if(!userNameCheck){
                            if(update.password && update.password != ''){
                                //encriptar y guardar
                                bcrypt.hash(update.password, null, null, function(err, hash){
                                       req.body.password = hash;
                                        //Guardar user
                                        User.findByIdAndUpdate(userId, update, (err, userUpdated) =>{
                                            if(err){
                                                logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                                                res.status(500).send({message: 'Error en el servidor al actualizar el usuario'});
                                            }else{ 
                                                if(!userUpdated){
                                                    logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                                                    res.status(404).send({message: 'No se ha podido encontrado el usuario'});
                                                }else{
                                                    logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                                                    res.status(200).send({user: userUpdated});
                                                }
                                            }
                                        }).populate(populateQuery);
                                });
                            }else{
                                User.findByIdAndUpdate(userId, update, (err, userUpdated) =>{
                                    if(err){
                                        logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                                        res.status(500).send({message: 'Error en el servidor al actualizar el usuario'});
                                    }else{
                                        if(!userUpdated){
                                            logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                                            res.status(404).send({message: 'No se ha podido encontrar el usuario'});
                                        }else{
                                            logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                                            res.status(200).send({user: userUpdated,message: 'actualizado sin pasar por bcrypt'});
                                        }
                                    }
                                }).populate(populateQuery);
                            }            
                            }else{
                            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Nombre de usuario no disponible'}});
                            res.status(400).send({message: 'Nombre de usuario no disponible'});
                        }
                    }
                });
            }
        }
    });


}

function getUser(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var userId = req.params.id;
    var functionName = 'getUser';


    var populateQuery = [
        {path:'company'},
        {path:'sector'}
    ];
    
    User.findById(userId, (err, user) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                console.log(err)
            res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!user){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado el usuario'});
            }else{
                res.status(200).send({user:user});
            }
        }
    }).populate(populateQuery)
}

function getNews(req, res){
    var decoded = jwt_decode(req.headers.authorization);
        var userId = req.params.id;
        var functionName = 'getNews';

        User.findById(userId, (err, user) =>{
            if(err){
                logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'});
            }else{
                if(!user){
                    logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                    res.status(404).send({message: 'No se ha encontrado el usuario'});
                }else{
                    if(user.news){
                        let update = {news:false};
                        User.findByIdAndUpdate(userId, update, (err, userUpdated) =>{
                             if(err){
                                logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                                 res.status(500).send({message: 'Error del servidor en la petición'});
                             }else{
                                 res.status(200).send({news:true});
                             }
                        });
                    }else{
                        res.status(200).send({news:false});
                    }
                }
            }
        })
}

function getUsers(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var role = req.params.role;
    var company = req.params.company;
    var functionName = 'getUsers';


    if(!role){
        User.find({company:company, deleted:false}).sort('name').exec(function(err, users){
            if(err){
                logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+getUsers.name, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
            }else{
                if(!users){
                    logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+getUsers.name, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay usuarios'})
                }else{
                     return res.status(200).send({
                        users: users
                    });
                }
            }
        });
    }else{
        if(role == 'ROLE_AGENT' || role == 'ROLE_ADMIN'){
            let query;
            if(company == 'null'){
                query = {$or: [{role: 'ROLE_AGENT'}, {role: 'ROLE_ADMIN'}], deleted:false}

            }else{
                query = {$or: [{role: 'ROLE_AGENT'}, {role: 'ROLE_ADMIN'}], deleted:false, company:company}
            }
            User.find(query).sort('name').exec(function(err, users){
                if(err){
                    logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
                }else{
                    if(!users){
                        logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay usuarios'})
                    }else{
                res.status(200).send({
                            users: users
                        });
                    }
                }
            });
        }else{
            let query = {$or:[{role:'ROLE_REQUESTER'},{company:{$ne:company}}], deleted:false};
            User.find(query).sort('name').exec(function(err, users){
                if(err){
                    logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
                }else{
                    if(!users){
                        logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay usuarios'})
                    }else{
                res.status(200).send({
                            users: users
                        });
                    }
                }
            });
        }
    }
    
}

function getAllUsers(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'getAllUsers';

    User.find({deleted:false}).sort('name').exec(function(err, users){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+getUsers.name, msg: decoded.userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!users){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+getUsers.name, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
            res.status(404).send({message: 'No hay usuarios'})
            }else{
                    return res.status(200).send({
                    users: users
                });
            }
        }
    });    
}

function getUsersForName(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var name = req.params.name;
    var company = req.params.company;
    var functionName = 'getUsersForName';

    User.find({company:ObjectId(company), deleted:false, $or:[{name:{ "$regex": name, "$options": "i" }},{surname:{ "$regex": name, "$options": "i" }}]}).sort('name').exec(function(err, users){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!users){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay usuarios'})
            }else{
                res.status(200).send({
                    users: users
                });
            }
        }
    });
}

function getReqForName(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var name = req.params.name;
    var functionName = 'getReqForName';

    User.find({role:'ROLE_REQUESTER', deleted:false ,$or:[{name:{ "$regex": name, "$options": "i" }},{surname:{ "$regex": name, "$options": "i" }}]}).sort('name').exec(function(err, users){
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!users){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No hay usuarios'})
            }else{
                res.status(200).send({
                    users: users
                });
            }
        }
    });
}

function loginUser(req, res){
    var params = req.body;
    var functionName = 'loginUser';
    
    var userName = params.userName;
    var password = params.password;    
    
    var populateQuery = [
        {path:'company',select:['name','email','image','mailSender']},
        {path:'sector',select:['name','email']}
    ];

    User.findOne({userName: userName.toLowerCase(), deleted:false}, (err, user) => {
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: userName+' ('+req.ip+') '+err}});
                console.log(err)
            res.status(500).send({message:'Error del servidor en la petición'});

                
        }else{
            if(!user){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message:'El usuario no existe'});
            }else{
                //comprobar la pass
                bcrypt.compare(password, user.password, function(err, check){
                    if(check){
                        //Devolver los datos del usuario logueado
                        if(params.gethash){
                            // devolver un token de jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }else{
                            logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: userName+' ('+req.ip+') Usuario conectado'}});
                            res.status(200).send({user})
                        }
                    }else{
                        logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: userName+' ('+req.ip+') Usuario/contraseña incorrecta'}});
                        res.status(404).send({message:'Usuario/contraseña incorrecta'});
                    }
                });
            }
        }
    }).populate(populateQuery);
}

function uploadImage(req, res){
var decoded = jwt_decode(req.headers.authorization);
    var userId = req.params.id;
    var file_name = 'No subido';
    var functionName = 'uploadImage';


    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\'); //eliminar y recortar las barras del path
        var file_name = file_split[2]; // [ 'uploads', 'users', 'pWgu0s-hHBgJl-5w1RSPS5G7.jpg' ]

        var ext_split = file_name.split('\.');
        var file_ext = ext_split [1]; //Comprueba si es un jpg [ 'j5HRZbfL7qgOgp2YRQ3F0ub8', 'jpg' ]

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'jpeg'){

            User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) =>{
                if(err){
                    logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error al actualizar el usuario'});
                }else{
                    if(!userUpdated){
                        logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                    }else{
                      logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({image: file_name, user: userUpdated});
                    }
                }
            });
        }else{
                      logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({message: 'Extension de archivo no valido'});
        }

    }else{
        logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Solicitud de '+req.params.id}});
                res.status(200).send({message: 'No ha subido ninguna imagen'});
    }
}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/users/'+imageFile;


    fs.exists(pathFile, function(exists){
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(200).send({message: 'No existe la imagen...'});
        }
    });
}

function deleteUser(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var userId = req.params.id;
    var functionName = 'deleteUser';


    User.findByIdAndUpdate(userId, {deleted:true}, (err, userRemoved) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!userRemoved){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'No se ha encontrado el usuario'});
            }else{
              logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                res.status(200).send({user:userRemoved})
            }
        }
    })
}

function forgotPassword(req, res){
    var userName = req.params.userName;
    var functionName = 'forgotPassword';
    var query = {$or:[{userName:userName},{email:userName}]};
    User.findOne(query, (err, user) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: userName+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!user){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: userName+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'El nombre de usuario no existe'});
            }else{
                bcrypt.hash(moment()+user.surname,null, null, function(err, hash){
                    let update = {
                        passToken:hash.split('/').join('').split('.').join('').split('$').join(''),
                        passTokenExp:moment().add(30,'minutes').unix()
                    }

                    User.findByIdAndUpdate(user._id, update, (err, userUpdated) =>{
                        if(err){
                            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: userName+' ('+req.ip+') '+err}});
                            res.status(500).send({message: 'Error del servidor en la petición'});
                        }else{
                            if(!userUpdated){
                                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: userName+' ('+req.ip+') Objeto no encontrado'}});
                                res.status(404).send({message: 'El nombre de usuario no existe'});
                            }else{
                                let txt = '<div style="position: relative;display: flex;flex-direction: column;min-width: 0;word-wrap: break-word;background-color: #fff;background-clip: border-box;border: 1px solid #e3e6f0;border-radius: .35rem;font-family: Nunito,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;"><div style="flex: 1 1 auto;padding: 1.25rem;"><h4 style="margin-bottom: .75rem;"><strong>¡Hola '+user.name+'!</strong></h4><hr/><p class="card-text">Se ha solicitado un cambio de contraseña para el usuario '+userUpdated.userName+', tiene 30 minutos para utilizar este link</p><hr /><a style="" href="http://10.0.0.98:3977/reset-password/'+userUpdated._id+'/'+update.passToken+'" role="button" >Cambiar contraseña</a><hr /><a style="" href="http://190.220.159.37:3977/reset-password/'+userUpdated._id+'/'+update.passToken+'" role="button" >Si estas fuera de la red del hospital, utiliza este link</a></div></div>'
                                let title = 'Recuperación de contraseña';
                                mail.forgot(userUpdated.email, title, txt);
                                logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                                res.status(200).send({mail:true});
                            }
                        }
                    });
                })
            }
        }
    });

}

function validUser(req, res){
    let id = req.params.id;
    let passToken = req.params.passToken;
    var functionName = 'validUser';

    User.findById(id, (err, user) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: id+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!user){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: id+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'URL no válida'});
            }else{
                if(user.passToken == passToken){
                    if(user.passTokenExp > moment().unix()){
                        logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: id+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                        res.status(200).send({user:user})
                    }else{
                        logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: id+' ('+req.ip+') '+'La URL ha expirado'}});
                        res.status(500).send({message: 'La URL ha expirado'});            
                    }
                }else{
                    logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: id+' ('+req.ip+') '+'URL no válida'}});
                    res.status(500).send({message: 'URL no válida'});        
                }
                
            }
        }
    }).select({_id:1, name:1, surname:1, passToken:1, passTokenExp:1})

}

function resetPass(req, res){
    let id = req.params.id;
    let passToken = req.params.passToken;
    var functionName = 'resetPass';

    User.findById(id, (err, user) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: id+' ('+req.ip+') '+err}});
            res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!user){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: id+' ('+req.ip+') Objeto no encontrado'}});
                res.status(404).send({message: 'URL no válida'});
            }else{
                if(user.passToken == passToken){
                    if(user.passTokenExp > moment().unix()){
                        let password = req.body.password;
                        //encriptar y guardar
                        bcrypt.hash(password, null, null, function(err, hash){
                            //Guardar user
                            User.findByIdAndUpdate(id, {password:hash, passTokenExp:moment().unix()}, (err, userUpdated) =>{
                                if(err){
                                    logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: userUpdated.userName+' ('+req.ip+') '+err}});
                                    res.status(500).send({message: 'Error en el servidor al actualizar el usuario'});
                                }else{
                                    if(!userUpdated){
                                        logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: userUpdated.userName+' ('+req.ip+') Objeto no encontrado'}});
                                        res.status(404).send({message: 'No se ha podido encontrado el usuario'});
                                    }else{
                                        logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: userUpdated.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                                        res.status(200).send({user: userUpdated});
                                    }
                                }
                            });
                        });
                    }else{
                        logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: id+' ('+req.ip+') '+'La URL ha expirado'}});
                        res.status(404).send({message: 'La URL ha expirado'});            
                    }
                }else{
                    logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: id+' ('+req.ip+') '+'URL no válida'}});
                    res.status(404).send({message: 'URL no válida'});        
                }
                
            }
        }
    }).select({_id:1, name:1, surname:1, passToken:1, passTokenExp:1})
}

function unifyUser(req, res){
    var decoded = jwt_decode(req.headers.authorization);
    var functionName = 'unifyUser';

    var userDest = req.params.userDest;
    var userOrigin = req.params.userOrigin;

    //Se conserva el destino, se elimina el origen

    User.findById(userDest, (err, userD) =>{
        if(err){
            logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
            return res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!userD){
                logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                return res.status(404).send({message: 'No se ha encontrado el usuario destino'});
            }else{
                User.findById(userDest, (err, userO) =>{
                    if(err){
                        logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                        return res.status(500).send({message: 'Error del servidor en la petición'});
                    }else{
                        if(!userO){
                            logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                            return res.status(404).send({message: 'No se ha encontrado el usuario origen'});
                        }else{
                            //Cambiar de usuario los tickets
                            var update;
                            var query;
                            var Ticket = require('../models/ticket');

                            if(userO.role == 'ROLE_REQUESTER'){
                                update = {requester:userDest};
                                query = {requester:userOrigin}
                            }else{
                                update = {agent:userDest};
                                query = {agent:userOrigin}
                            }

                            Ticket.updateMany(query, update, (err, userUpdated) =>{
                                if(err){
                                    logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                                }else{
                                    if(!userUpdated){
                                        logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                                    }
                                }
                            });


                            //Cambiar persona en copia
                            query = {cc: userOrigin}
                            Ticket.updateMany(
                                query,
                                { $pull: {"cc": userOrigin}},
                                {  safe: true, upsert: false},
                                function(err, ticket) {
                            });

                            Ticket.updateMany(
                                query,
                                { $push: {"cc": userDest}},
                                {  safe: true, upsert: false},
                                function(err, ticket) {
                            });

                        
                            
                            //Eliminar origen
                            User.findByIdAndDelete(userOrigin, (err,userRemoved)=>{
                                if(err){
                                    logger.error({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') '+err}});
                                }else{
                                    if(!userRemoved){
                                        logger.warn({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Objeto no encontrado'}});
                                    }else{
                                        logger.info({message:{module:path.basename(__filename).substring(0, path.basename(__filename).length - 3)+'/'+functionName, msg: decoded.userName+' ('+req.ip+') Petición realizada | params:'+JSON.stringify(req.params)+' body:'+JSON.stringify(req.body)}});
                                        return res.status(200).send({user:userRemoved})
                                    }
                                }
                            })
                        }
                    }
                })

            }
        }
    })
}

module.exports = {
    saveUser,
    updateUser,
    deleteUser,
    unifyUser,

    uploadImage,
    getImageFile,

    getUser,
    getAllUsers,
    getUsers,
    getUsersForName,
    getReqForName,
    validUser,
    getNews,

    loginUser,
    forgotPassword,
    resetPass
};