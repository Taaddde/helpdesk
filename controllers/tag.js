'use strict'

var Tag = require('../models/tag');

function getTag(req, res){
    var tagId = req.params.id;

    Tag.findById(tagId, (err, tag) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!tag){
                res.status(404).send({message: 'La etiqueta no existe'});
            }else{
                res.status(200).send({tag});
            }
        }
    });
}

function saveTag(req, res){
    var tag = new Tag();

    var params = req.body;

    tag.name = params.name;

    tag.save((err, tagStored) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la petición'})
        }else{
            if(!tagStored){
                res.status(404).send({message: 'La etiqueta no ha sido guardado'})
            }else{
                res.status(200).send({tag:tagStored})
            }
        }
    });
}


function getTags(req, res){
    Tag.find({}).sort('name').exec(function(err, tags){
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!tags){
                res.status(404).send({message: 'No hay etiquetas'})
            }else{
                return res.status(200).send({
                    tags: tags
                });
            }
        }
    });
}

function getTagsForName(req, res){
    var name = req.body.name;
    Tag.find({name: { "$regex": name, "$options": "i" }}).sort('name').exec(function(err, tags){
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!tags){
                res.status(404).send({message: 'No hay etiquetas'})
            }else{
                return res.status(200).send({
                    tags: tags
                });
            }
        }
    });
}

function updateTag(req, res){
    var tagId = req.params.id;
    var update =  req.body;

    //tagId = tag buscado, update = datos nuevos a actualizar
    Tag.findByIdAndUpdate(tagId, update, (err, tagUpdated) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!tagUpdated){
                res.status(404).send({message: 'No se ha encontrado La etiqueta'});
            }else{
                res.status(200).send({tag:tagUpdated});
            }
        }
    });
}

function deleteTag(req, res){
    var tagId = req.params.id;

    Tag.findByIdAndDelete(tagId, (err, tagRemoved) =>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!tagRemoved){
                res.status(404).send({message: 'No se ha encontrado La etiqueta'});
            }else{
                res.status(200).send({tag: tagRemoved});
            }
        }
    });
}

module.exports = {
    getTag,
    getTagsForName,
    getTags,

    saveTag,
    updateTag,
    deleteTag,
};