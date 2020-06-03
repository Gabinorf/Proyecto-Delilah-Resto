const db = require('../config/database');
const security = require('../config/security');

/****************************************************************************************************
        INSERTAR ALGUNOS DATOS EN LA DB
****************************************************************************************************/

async function dataDB () {

    //Inserta un usuario administrador
    const passwordCrypt = await security.encryptPassword("super_segura");
    await db.sequelize.query(
        `INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        {replacements:  [
                            null,
                            'Admin', 
                            'Admin Master', 
                            'master@admin.com', 
                            '+02666228882', 
                            'Local Host 345', 
                            passwordCrypt, 
                            true, 
                            null, 
                            null
                        ]
        }
    );


    //Inserta productos
    await db.sequelize.query(
        `INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        {replacements:  [
                            null,
                            'Hamburguesa Clásica', 
                            'carne, tomate, lechuga, salsas', 
                            '350.00', 
                            'image.url', 
                            true,
                            null, 
                            null
                        ]
        }
    );
    await db.sequelize.query(
        `INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        {replacements:  [
                            null,
                            'Bagel de salmón', 
                            'pan de harina de trigo, salmón, queso cremoso', 
                            '425.00', 
                            'image2.url', 
                            true,
                            null, 
                            null
                        ]
        }
    );
    await db.sequelize.query(
        `INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        {replacements:  [
                            null,
                            'Sandwich veggie', 
                            'pan integral, tomate, lechuga', 
                            '310.00', 
                            'image3.url', 
                            true,
                            null, 
                            null
                        ]
        }
    );
    await db.sequelize.query(
        `INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        {replacements:  [
                            null,
                            'Ensalada veggie', 
                            'tomate, lechuga, cebolla, zanahoria', 
                            '340.00', 
                            'image4.url', 
                            true,
                            null, 
                            null
                        ]
        }
    );
    await db.sequelize.query(
        `INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        {replacements:  [
                            null,
                            'Veggie avocado', 
                            'pan con sésamo, albaca, pepino', 
                            '310.00', 
                            'image5.url', 
                            true,
                            null, 
                            null
                        ]
        }
    );
    await db.sequelize.query(
        `INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        {replacements:  [
                            null,
                            'Focaccia', 
                            'pan casero, finas hierbas', 
                            '280.00', 
                            'image6.url', 
                            true,
                            null, 
                            null
                        ]
        }
    );
    console.log('\nDATOS INSERTADOS CORRECTAMENTE :)');
}

dataDB();