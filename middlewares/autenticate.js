'use strict'

var jwt = require('jwt-simple');
var moment = require('moment'); //fecha de creacion y expiracion del tocken
var secret = "Havanna"; //clave secreta que usa jwt
var logger = require('../services/logger');


exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
         return res.status(403).send({message: 'La peticion no tiene la cabecera de autenticación'});
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');
    var payload = null;
    try{
        payload = jwt.decode(token, secret);

        if(payload.exp <= moment().unix()){
            logger.error({message:{module:'autenticate/ensureAuth', msg: payload.userName+' Token expirado'}});
            return res.status(401).send({message: 'El token a expirado'});
        }
    }catch(ex){
        if(payload){
            logger.error({message:{module:'autenticate/ensureAuth', msg: payload.userName+' Token no valido'}});
        }
        return res.status(404).send({message: 'Token no valido'});
    }

    req.user = payload;

    next();
};