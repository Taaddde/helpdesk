'use strict'
const {createLogger, format, transports} = require('winston');
const moment = require('moment');
 
module.exports = createLogger({
    format: format.combine(
        format.simple(),
        format.printf(info=>'['+moment().format("DD-MM-YYYY HH:mm")+'] ['+info.level+'] ['+info.message.module+'] '+info.message.msg)
    ),
    transports: [
        new transports.File({
            maxsize: 5120000,
            maxFiles: 5,
            filename: '${__dirname}/../logs/log',
        }),
    ]
})