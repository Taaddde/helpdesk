'use strict'

var jwt = require('jwt-simple');
var moment = require('moment'); //fecha de creacion y expiracion del tocken
var secret = "Havanna"; //clave secreta que usa jwt


exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
         return res.status(403).send({message: 'La peticion no tiene la cabecera de autenticación'});
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    try{
        var payload = jwt.decode(token, secret);

        if(payload.exp <= moment().unix()){
            return res.status(401).send({message: 'El token a expirado'});
        }
    }catch(ex){
        //console.log('Token expirado')
        //console.log(ex);
        return res.status(404).send({message: 'Token no valido'});
    }

    req.user = payload;

    next();
};