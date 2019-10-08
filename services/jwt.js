'use strict'

var jwt = require('jwt-simple');
var moment = require('moment'); //fecha de creacion y expiracion del tocken
var secret = "Havanna"; //clave secreta que usa jwt

//Que queremos ponerle al token



exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        userName: user.userName,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(), //fecha de creacion
        exp: moment().add(30, 'days').unix() //fecha de expiracion (30 dias)
    };

    return jwt.encode(payload, secret);
};