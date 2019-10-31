'use strict'

var Company = require('../models/company');
//Sistema de ficheros
var fs = require('fs');
var path = require('path');


function getCompanies(req, res){

    Company.find({}, (err, companies) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!companies){
                res.status(404).send({message: 'La compañia no existe'});
            }else{
                res.status(200).send({companies:companies});
            }
        }
    });
}

function saveCompany(req, res){
    var company = new Company();

    var params = req.body;

    company.name = params.name;
    company.email = params.email;

    company.save((err, companyStored) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la petición'})
        }else{
            if(!companyStored){
                res.status(404).send({message: 'La compañia no ha sido guardado'})
            }else{
                res.status(200).send({company:companyStored})
            }
        }
    });
}


function updateCompany(req, res){
    var companyId = req.params.id;
    var update =  req.body;

    //companyId = company buscado, update = datos nuevos a actualizar
    Company.findByIdAndUpdate(companyId, update, (err, companyUpdated) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!companyUpdated){
                res.status(404).send({message: 'No se ha encontrado La compañia'});
            }else{
                res.status(200).send({company:companyUpdated});
            }
        }
    });
}

function deleteCompany(req, res){
    var companyId = req.params.id;

    Company.findByIdAndDelete(companyId, (err, companyRemoved) =>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!companyRemoved){
                res.status(404).send({message: 'No se ha encontrado La compañia'});
            }else{
                res.status(200).send({company: companyRemoved});
            }
        }
    });
}

function uploadImage(req, res){
    var companyId = req.params.id;
    var file_name = 'No subido';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\'); //eliminar y recortar las barras del path
        var file_name = file_split[2]; // [ 'uploads', 'companys', 'pWgu0s-hHBgJl-5w1RSPS5G7.jpg' ]

        var ext_split = file_name.split('\.');
        var file_ext = ext_split [1]; //Comprueba si es un jpg [ 'j5HRZbfL7qgOgp2YRQ3F0ub8', 'jpg' ]

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

            Company.findByIdAndUpdate(companyId, {image: file_name}, (err, companyUpdated) =>{
                if(err){
                    res.status(500).send({message: 'Error al actualizar el usuario'});
                }else{
                    if(!companyUpdated){
                        res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                    }else{
                        res.status(200).send({image: file_name, company: companyUpdated});
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
    var pathFile = './uploads/companys/'+imageFile;

    fs.exists(pathFile, function(exists){
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(200).send({message: 'No existe la imagen...'});
        }
    });
}

module.exports = {
    getCompanies,
    saveCompany,
    updateCompany,
    deleteCompany,
    uploadImage,
    getImageFile
};