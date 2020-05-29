const db = require('../config/database');
db.sequelize = new db.Sequelize('mysql://root:@localhost:3306');


/****************************************************************************************************
            ESTRUCTURA DE LA BASE DE DATOS
****************************************************************************************************/

async function structureDB (){
    await db.sequelize.query(`DROP DATABASE IF EXISTS delilah_resto_v1`)
    //Crear base de datos
    await db.sequelize.query(`CREATE DATABASE delilah_resto_v1`);

    //Usar base de datos creada
    db.sequelize = new db.Sequelize('mysql://root:@localhost:3306/delilah_resto_v1');

    //Crear tabla de usuarios
    await db.sequelize.query(`CREATE TABLE users(
        id                      INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        username                VARCHAR(60) NOT NULL,
        fullname                VARCHAR(120) NOT NULL,  
        email                   VARCHAR(120) NOT NULL,
        phone                   VARCHAR(60) NOT NULL,
        address                 VARCHAR(120) NOT NULL,
        password                VARCHAR(60) NOT NULL,
        admin                   BOOLEAN NOT NULL DEFAULT FALSE,
        created                 TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated                 TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
        )`
    );

    //Crear tabla de productos
    await db.sequelize.query(`CREATE TABLE products(
        id                      INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        name                    VARCHAR(60) NOT NULL,
        description             VARCHAR(255) NULL, 
        price                   DOUBLE NOT NULL,
        image                   VARCHAR(255) NULL,
        stock                   BOOLEAN NOT NULL DEFAULT TRUE,
        created                 TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated                 TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
        )`
    );

    //Crear tabla de pedidos
    await db.sequelize.query(`CREATE TABLE orders(
        id                      INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        user_id                 INT NOT NULL,
        total                   DOUBLE(6,2) NOT NULL,
        payment                 ENUM('cash','credit card') NOT NULL DEFAULT 'cash',
        status                  ENUM('new','confirmed','in process', 'on way', 'delivered') NOT NULL,
        created                 TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated                 TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
        )`
    );

    //Crear tabla de productos por pedido
    await db.sequelize.query(`CREATE TABLE order_products(
        id                      INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        order_id                INT NOT NULL,
        product_id              INT NOT NULL
        )`
    ); 
    
    //Crear tabla 'favorites'
    await db.sequelize.query(`CREATE TABLE favorites(
        id                      INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        user_id                 INT NOT NULL,
        product_id              INT NOT NULL
        )`
    );
    console.log('\nBASE DE DATOS CREADA CORRECTAMENTE :)');
}

structureDB();