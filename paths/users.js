const express = require('express');
const router = express.Router();
const security = require('../config/security');
const db = require('../config/database');


//  CREAR USUARIO
router.post('/',async (req,res)=>{
    try{
        let result = await db.sequelize.query(`SELECT username, email FROM users`,
                {type: db.sequelize.QueryTypes.SELECT})
                .then(response=>{
                    return response
            });
        let notExist = true; 
       
        await result.forEach(elemento => {
            if (elemento.username.toLowerCase() == req.body.username.toLowerCase() || elemento.email == req.body.email) {
                notExist = false;
            }
        });     
        if (notExist) {
            db.sequelize.query(`INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                {replacements: [null, req.body.username, req.body.fullname, req.body.email, req.body.phone, req.body.address, req.body.password, false, null, null]})
            .then(response=>{
                res.status(201).json({msj:"Nuevo usuario creado"});
            })
        }
        else{
            res.status(409).json({msj:"El usuario ya existe"});
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
                    res.status(200).json({msj: 'No se econtraron resultados'});
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
router.post('/login', security.validarUsuario, (req, res) => {   
});

//  OBTENER USUARIO POR ID
router.get('/:id', security.autorizarUsuario, async (req, res) => {
    const id = req.params.id;
    if(req.id == id || req.admin){
        await db.sequelize.query(`SELECT * FROM users WHERE id=${id}`,
        {type: db.sequelize.QueryTypes.SELECT})
        .then(response=>{
            if (response.length == 0){
                res.status(404).json({msj: 'El usuario no existe'});
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
router.put('/:id', security.autorizarUsuario, (req,res)=>{
    const id = req.params.id;
    if(req.id == id){
        db.sequelize.query(`UPDATE users SET username = ?, fullname = ?, email = ?, phone = ?, address = ?, password = ? WHERE id=${id}`,
        {replacements: [req.body.username, req.body.fullname, req.body.email, req.body.phone, req.body.address, req.body.password]})
        .then(response=>{
           res.status(200).json({msj:"Actualizacion exitosa"});
        })
    }
    else{
        res.status(403).json({msj: "Sin permiso"})
    }
})

//  ELIMINAR USUARIO POR ID
router.delete('/:id', security.autorizarUsuario, (req,res)=>{
    const id = req.params.id;
    if(req.id == id || req.admin){
        db.sequelize.query(`DELETE FROM users WHERE id=?`,
        {replacements: [id]})
    .then((response=>{
        res.status(204).json({msj: "Usuario eliminado"})   
    })) 
    }
    else{
        res.status(403).json({msj: "Sin permiso"})
    }
})



// DAR PERMISOS DE ADMINISTRADOR
router.patch('/:id', security.autorizarUsuario, (req,res)=>{
    const id = req.params.id;
    if(req.admin){
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
    else{
        res.status(403).json({msj: "Sin permiso"})
    }
})

// OBTENER FAVORITOS
router.get("/:id/favorites", security.autorizarUsuario, async (req,res)=>{
    const id = req.params.id;
    if(req.id == id || req.admin){
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
    else{
        res.status(403).json({msj: "Sin permiso"})
    }
})            


module.exports = router;