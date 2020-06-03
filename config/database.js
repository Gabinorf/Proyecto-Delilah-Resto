/********************************************************************************
        CONEXIÓN A BASE DE DATOS
********************************************************************************/

const data = require('../db/data')
const Sequelize = require('sequelize');
const sequelize = new Sequelize( data.name, data.user, data.password, {
        host: data.host,
        dialect: 'mysql',
        port: data.port,
        dialectOptions: {
                multipleStatements: true
        }
});

module.exports = {sequelize, Sequelize};