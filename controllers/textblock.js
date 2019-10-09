'use strict'

var TextBlock = require('../models/textblock');

function getTextBlock(req, res){
    var textblockId = req.params.id;

    TextBlock.findById(textblockId, (err, textblock) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!textblock){
                res.status(404).send({message: 'El bloque de texto no existe'});
            }else{
                res.status(200).send({textblock});
            }
        }
    });
}

function getTextBlocks(req, res){
    var textblockId = req.params.id;

    TextBlock.find({}, (err, textblocks) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion'});
        }else{
            if(!textblocks){
                res.status(404).send({message: 'El bloque de texto no existe'});
            }else{
                res.status(200).send({textblocks});
            }
        }
    });
}

function saveTextBlock(req, res){
    var textblock = new TextBlock();

    var params = req.body;

    textblock.text = params.text;
    textblock.ticket = params.ticket;

    textblock.save((err, textblockStored) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la petición'})
        }else{
            if(!textblockStored){
                res.status(404).send({message: 'El bloque de texto no ha sido guardado'})
            }else{
                res.status(200).send({textblock:textblockStored})
            }
        }
    });
}

function getTextBlockForText(req, res){
    var text = req.body.text;
    TextBlock.find({text: { "$regex": text, "$options": "i" }}).sort('createDate').exec(function(err, textblocks){
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!textblocks){
                res.status(404).send({message: 'No hay bloque de textos'})
            }else{
                return res.status(200).send({
                    textblocks: textblocks
                });
            }
        }
    });
}

function getTextBlockForTicket(req, res){
    var ticket = req.body.ticket;
    TextBlock.find({ticket: ticket}).sort('createDate').exec(function(err, textblocks){
        if(err){
            res.status(500).send({message: 'Error del servidor en la peticion'})
        }else{
            if(!textblocks){
                res.status(404).send({message: 'No hay bloque de textos'})
            }else{
                return res.status(200).send({
                    textblocks: textblocks
                });
            }
        }
    });
}

function updateTextBlock(req, res){
    var textblockId = req.params.id;
    var update =  req.body;

    //textblockId = textblock buscado, update = datos nuevos a actualizar
    TextBlock.findByIdAndUpdate(textblockId, update, (err, textblockUpdated) =>{
        if(err){
            res.status(500).send({message: 'Error del servidor en la petición'});
        }else{
            if(!textblockUpdated){
                res.status(404).send({message: 'No se ha encontrado El bloque de texto'});
            }else{
                res.status(200).send({textblock:textblockUpdated});
            }
        }
    });
}

function deletetextblock(req, res){
    var textblockId = req.params.id;

    TextBlock.findByIdAndDelete(textblockId, (err, textblockRemoved) =>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!textblockRemoved){
                res.status(404).send({message: 'No se ha encontrado El bloque de texto'});
            }else{
                res.status(200).send({textblock: textblockRemoved});
            }
        }
    });
}

module.exports = {
    getTextBlock,
    getTextBlockForText,
    getTextBlockForTicket,
    getTextBlocks,

    saveTextBlock,
    updateTextBlock,
    deletetextblock,
};