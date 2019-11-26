'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');
//Sistema de ficheros
var fs = require('fs');
var path = require('path');

//Sistema de log
var logger = require('../services/logger')


const mongoose =require('mongoose')

const ObjectId = mongoose.Types.ObjectId;


function prueba(req, res){
    var ip = req.ip;
     console.log(req.body, ip);

    res.status(200).send({message:"Su solicitud fue realizada con éxito"})
}

function saveUser(req, res){
    var user = new User();

    var params = req.body;

    user.name = params.name;
    user.surname = params.surname;
    user.userName = params.userName;
    user.email = params.email;
    user.sign = params.sign;
    user.role = params.role;
    user.image = 'null';
    user.company = params.company;
    user.receiveMail = params.receiveMail;

    if(params.password){
        //encriptar y guardar
        bcrypt.hash(params.password, null, null, function(err, hash){
            
            if(user.name != null && user.surname != null && user.userName != null && user.email != null){
                user.password = hash;
                //Guardar user
                user.save((err, userStore) => {
                    if(err){
                        res.status(500).send({message:'Error en el servidor al guardar el usuario'});
                    }else{
                       if(!userStore){
                        res.status(404).send({message:'No se ha encontrado el usuario'});
                       }else{
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
                res.status(500).send({message:'Error en el servidor al guardar el usuario'});
            }else{
               if(!userStore){
                res.status(404).send({message:'No se ha encontrado el usuario'});
               }else{
                res.status(200).send({user:userStore});
               }
            }
        });
    }
}

function updateUser(req, res){
    var userId = req.params.id;

    var update = req.body;

    if(update.password && update.password != ''){
        //encriptar y guardar
        bcrypt.hash(update.password, null, null, function(err, hash){
               req.body.password = hash;
                //Guardar user
                User.findByIdAndUpdate(userId, update, (err, userUpdated) =>{
                    if(err){
                        res.status(500).send({message: 'Error en el servidor al actualizar el usuario'});
                    }else{
                        if(!userUpdated){
                            res.status(404).send({message: 'No se ha podido encontrado el usuario'});
                        }else{
                            res.status(200).send({user: userUpdated});
                        }
                    }
                });
        });
    }else{
        User.findByIdAndUpdate(userId, update, (err, userUpdated) =>{
            if(err){
                res.status(500).send({message: 'Error en el servidor al actualizar el usuario'});
            }else{
                if(!userUpdated){
                    res.status(404).send({message: 'No se ha podido encontrar el usuario'});
                }else{
                    res.status(200).send({user: userUpdated,message: 'actualizado sin pasar por bcrypt'});
                }
            }
        });
    }
}

function getUser(req, res){
    var userId = req.params.id;

    var populateQuery = [
        {path:'company'},
    ];
    User.findById(userId, (err, user) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!user){
                res.status(404).send({message: 'No se ha encontrado el usuario'});
            }else{
                res.status(200).send({user:user});
            }
        }
    }).populate(populateQuery)
}

function getUsers(req, res){
    var role = req.params.role;
    var company = req.params.company;

    if(!role){
        User.find({}).sort('name').exec(function(err, users){
            if(err){
                res.status(500).send({message: 'Error del servidor en la peticion'})
            }else{
                if(!users){
                    res.status(404).send({message: 'No hay usuarios'})
                }else{
                    return res.status(200).send({
                        users: users
                    });
                }
            }
        });
    }else{
        if(role == 'ROLE_AGENT'){
            User.find({$or: [{role: 'ROLE_AGENT'}, {role: 'ROLE_ADMIN'}],company:company}).sort('name').exec(function(err, users){
                if(err){
                    res.status(500).send({message: 'Error del servidor en la peticion'})
                }else{
                    if(!users){
                        res.status(404).send({message: 'No hay usuarios'})
                    }else{
                        return res.status(200).send({
                            users: users
                        });
                    }
                }
            });
        }else{
            User.find({role:role}).sort('name').exec(function(err, users){
                if(err){
                    res.status(500).send({message: 'Error del servidor en la peticion'})
                }else{
                    if(!users){
                        res.status(404).send({message: 'No hay usuarios'})
                    }else{
                        return res.status(200).send({
                            users: users
                        });
                    }
                }
            });
        }
        
    }
    
}

function getUsersForName(req, res){
    var name = req.params.name;
    var company = req.params.company;

    User.find({company:ObjectId(company),$or:[{name:{ "$regex": name, "$options": "i" }},{surname:{ "$regex": name, "$options": "i" }}]}).sort('name').exec(function(err, users){
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!users){
                res.status(404).send({message: 'No hay usuarios'})
            }else{
                return res.status(200).send({
                    users: users
                });
            }
        }
    });
}


function loginUser(req, res){
    var params = req.body;

    var userName = params.userName;
    var password = params.password;
    
    var populateQuery = [
        {path:'company',select:['name','email','image','mailSender']}    
    ];

    User.findOne({userName: userName.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500).send({message:'Error del servidor en la petición'});
        }else{
            if(!user){
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
                            res.status(200).send({user})
                        }
                    }else{
                        res.status(404).send({message:'Usuario/contraseña incorrecta'});
                    }
                });
            }
        }
    }).populate(populateQuery);
}

function uploadImage(req, res){
    var userId = req.params.id;
    var file_name = 'No subido';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\'); //eliminar y recortar las barras del path
        var file_name = file_split[2]; // [ 'uploads', 'users', 'pWgu0s-hHBgJl-5w1RSPS5G7.jpg' ]

        var ext_split = file_name.split('\.');
        var file_ext = ext_split [1]; //Comprueba si es un jpg [ 'j5HRZbfL7qgOgp2YRQ3F0ub8', 'jpg' ]

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

            User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) =>{
                if(err){
                    res.status(500).send({message: 'Error al actualizar el usuario'});
                }else{
                    if(!userUpdated){
                        res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                    }else{
                        res.status(200).send({image: file_name, user: userUpdated});
                    }
                }
            });
        }else{
            res.status(200).send({message: 'Extension de archivo no valido'});
        }

        console.log(ext_split);
    }else{
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
    var userId = req.params.id;

    User.findByIdAndDelete(userId, (err, userRemoved) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!userRemoved){
                res.status(404).send({message: 'No se ha encontrado el usuario'});
            }else{
                res.status(200).send({user:userRemoved})
            }
        }
    })
}

module.exports = {
    saveUser,
    updateUser,
    deleteUser,

    uploadImage,
    getImageFile,

    getUser,
    getUsers,
    getUsersForName,

    loginUser,


    prueba
};