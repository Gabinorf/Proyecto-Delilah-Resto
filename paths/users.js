const express = require('express');
const router = express.Router();
const security = require('../config/security');
const db = require('../config/database');



//  CREAR USUARIO
router.post('/',async (req,res)=>{
    const {username, fullname, email, phone, address, password} = req.body;
    const passwordCrypt = await security.encryptPassword(password);
    try{
        let result = await db.sequelize.query(`SELECT username, email FROM users`,
                {type: db.sequelize.QueryTypes.SELECT})
                .then(response=>{
                    return response
            });
        let notExist = true; 
       
        await result.forEach(elemento => {
            if (elemento.username.toLowerCase() == req.body.username.toLowerCase() || elemento.email.toLowerCase() == req.body.email.toLowerCase()) {
                notExist = false;
            }
        });     
        if (notExist) {
            db.sequelize.query(`INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                {replacements: [null, username, fullname, email, phone, address, passwordCrypt, false, null, null]})
            .then(response=>{
                res.status(201).json({msj:"Nuevo usuario creado"});
            })
        }
        else{
            res.status(409).json({msj:"Usuario ya existe"});
        }
    }
    catch (err) {
        res.send(err);
    }
})

//  OBTENER LISTA DE USUARIOS
router.get('/', security.autorizarUsuario, async (req, res) => {
    if(req.admin){
        if (req.query.fullname){
            const name = req.query.fullname;
             db.sequelize.query(`SELECT * FROM users WHERE fullname LIKE '${name}%'`,
                {type: db.sequelize.QueryTypes.SELECT})
            .then(response=>{
                if (response.length == 0){
                    res.status(404).json({msj: 'Usuario no encontrado'});
                }
                else{
                    res.status(200).json(response);
                }
            })
        }
        else{
            await db.sequelize.query(`SELECT * FROM users`,
            {type: db.sequelize.QueryTypes.SELECT})
            .then(response=>{
                res.status(200).json(response);
            })
        }
    }
    else{
        res.status(403).json({msj: "Sin permiso"})
    }
});

//  INGRESO DE USUARIO
router.get('/login', security.validarUsuario, (req, res) => {   
});

//  OBTENER USUARIO POR ID
router.get('/:id', security.autorizarUsuario, async (req, res) => {
    const id = req.params.id;
    if(req.id == id || req.admin){
        await db.sequelize.query(`SELECT * FROM users WHERE id=${id}`,
        {type: db.sequelize.QueryTypes.SELECT})
        .then(response=>{
            if (response.length == 0){
                res.status(404).json({msj: 'Usuario no encontrado'});
            }
            else{
                res.status(200).json(response);
            }    
        })
    }
    else{
        res.status(403).json({msj: "Sin permiso"})
    }
});

//  ACTUALIZAR USUARIO POR ID
router.put('/:id', security.autorizarUsuario, async (req,res)=>{
    const id = req.params.id;
    const {username, fullname, email, phone, address, password} = req.body;
    const passwordCrypt = await security.encryptPassword(password);
    if(req.id == id){
        if(username!=""){
            db.sequelize.query(`UPDATE users SET username = ? WHERE id=${id}`,
            {replacements: [username]});   
        }
        if(fullname!=""){
            db.sequelize.query(`UPDATE users SET fullname = ? WHERE id=${id}`,
            {replacements: [fullname]});   
        }
        if(email!=""){
            db.sequelize.query(`UPDATE users SET email = ? WHERE id=${id}`,
            {replacements: [email]});   
        }
        if(phone!=""){
            db.sequelize.query(`UPDATE users SET phone = ? WHERE id=${id}`,
            {replacements: [phone]});   
        }
        if(address!=""){
            db.sequelize.query(`UPDATE users SET address = ? WHERE id=${id}`,
            {replacements: [address]});   
        }
        if(password!=""){
            db.sequelize.query(`UPDATE users SET password = ? WHERE id=${id}`,
            {replacements: [passwordCrypt]});   
        }
        res.status(200).json({msj:"Actualización exitosa"});            
    }
    else{
        res.status(403).json({msj: "Sin permiso"})
    }
})

//  ELIMINAR USUARIO POR ID
router.delete('/:id', security.autorizarUsuario, async (req,res)=>{
    const id = req.params.id;
    if(req.id == id || req.admin){
        await db.sequelize.query(`SELECT * FROM users WHERE id=${id}`,
        {type: db.sequelize.QueryTypes.SELECT})
        .then(response=>{
            if (response.length == 0){
                res.status(404).json({msj: 'Usuario no encontrado'});
            }
            else{
                db.sequelize.query(`DELETE FROM users WHERE id=?`,
                    {replacements: [id]})
                .then(response=>{
                    res.status(200).json({msj: "Usuario eliminado"})   
                })        
            }    
        })
    }
    else{
        res.status(403).json({msj: "Sin permiso"})
    }
})



// DAR PERMISOS DE ADMINISTRADOR
router.patch('/:id', security.autorizarUsuario, async (req,res)=>{
    const id = req.params.id;
    if(req.admin){
        await db.sequelize.query(`SELECT * FROM users WHERE id=${id}`,
            {type: db.sequelize.QueryTypes.SELECT})
        .then(response=>{
            if (response.length == 0){
                res.status(404).json({msj: 'Usuario no encontrado'});
            }
            else{
                db.sequelize.query(`UPDATE users SET admin = ? WHERE id=${id}`,
                    {replacements: [req.query.admin]})
                .then(response=>{
                    if (req.query.admin==1){
                        res.status(200).json({msj:"Operación exitosa"});
                    }
                    else{
                        res.status(200).json({msj:"Operación exitosa"});
                    }       
                })
            }    
        })
    }
    else{
        res.status(403).json({msj: "Sin permiso"})
    }
})

// OBTENER FAVORITOS
router.get("/:id/favorites", security.autorizarUsuario, async (req,res)=>{
    const id = req.params.id;
    if(req.id == id || req.admin){
        await db.sequelize.query(`SELECT * FROM users WHERE id=${id}`,
            {type: db.sequelize.QueryTypes.SELECT})
        .then(async (response) => {
            if (response.length == 0){
                res.status(404).json({msj: 'No se encontraron resultados'});
            }
            else{
                await db.sequelize.query(`SELECT favorites.product_id, products.name, products.description, products.price FROM favorites 
                    JOIN products ON favorites.product_id = products.id WHERE user_id=${id}`,
                    {type: db.sequelize.QueryTypes.SELECT})
                .then(response=>{
                    if (response.length == 0){
                        res.status(404).json({msj: 'No se encontraron resultados'});
                    }
                    else{
                        res.status(200).json(response);
                    }
                })
            }
        })        
    }
    else{
        res.status(403).json({msj: "Sin permiso"})
    }
})            


module.exports = router;