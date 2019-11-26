'use strict'
const {createLogger, format, transports} = require('winston');
const moment = require('moment');

var time = moment().format("DD-MM-YYYY HH:mm")
 
module.exports = createLogger({
    format: format.combine(
        format.simple(),
        format.printf(info=>'['+time+'] ['+info.level+'] ['+info.message.module+'] '+info.message.msg)
    ),
    transports: [
        new transports.File({
            maxsize: 5120000,
            maxFiles: 5,
            filename: '${__dirname}/../logs/log',
        }),
        new transports.Console({
            level: 'debug',
        })
    ]
})