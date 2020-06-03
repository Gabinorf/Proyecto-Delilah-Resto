const express = require('express');
const router = express.Router();
const security = require('../config/security');
const db = require('../config/database');


//  OBTENER LISTA DE PRODUCTOS
router.get('/', security.autorizarUsuario, async (req, res) => {
    if (req.query.name){
        const name = req.query.name;
         db.sequelize.query(`SELECT * FROM products WHERE name LIKE '${name}%'`,
            {type: db.sequelize.QueryTypes.SELECT})
        .then(response=>{
            if (response.length == 0){
                res.status(404).json({msj: 'Producto no encontrado'});
            }
            else{
                res.status(200).json(response);
            }
        })
    }
    else{
        await db.sequelize.query(`SELECT * FROM products`,
        {type: db.sequelize.QueryTypes.SELECT})
        .then(response=>{
            res.status(200).json(response);
        })
    }
    
   
});


//  CREAR PRODUCTO
router.post("/", security.autorizarUsuario, async (req,res)=>{
    if(req.admin){
        let result = await db.sequelize.query(`SELECT name FROM products`,
            {type: db.sequelize.QueryTypes.SELECT})
            .then(response=>{
                return response
            });
        let notExist = true; 
        await result.forEach(elemento => {
            if (elemento.name.toLowerCase() == req.body.name.toLowerCase()) {
                notExist = false;
            }
        });     
        if (notExist) {
            db.sequelize.query(`INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                {replacements: [null, req.body.name, req.body.description, req.body.price, req.body.image, req.body.stock, null, null]})
            .then(response=>{
                res.status(201).json({msj:"Nuevo producto creado"});
            })
        }
        else{
            res.status(409).json({msj:"El producto ya existe"});
        }      
    }
    else{
        res.status(403).json({msj: "Sin permiso"})
    }
})

//  OBTENER PRODUCTOS POR ID
router.get('/:id', security.autorizarUsuario, async (req, res) => {
    const id = req.params.id;
    await db.sequelize.query(`SELECT * FROM products WHERE id=${id}`,
        {type: db.sequelize.QueryTypes.SELECT})
    .then(response=>{
        if (response.length == 0){
            res.status(404).json({msj: 'Producto no encontrado'});
        }
        else{
            res.status(200).json(response);
        }
    })
});

// ACTUALIZAR PRODUCTO POR ID
router.put('/:id', security.autorizarUsuario, async (req,res)=>{
    const id = req.params.id;
    const {name, description, price, image, stock}=req.body;
    if(req.admin){
        await db.sequelize.query(`SELECT * FROM products WHERE id=${id}`,
            {type: db.sequelize.QueryTypes.SELECT})
        .then(response=>{
            if (response.length == 0){
                res.status(404).json({msj: 'Producto no encontrado'});
            }
            else{
                if(name!=""){
                    db.sequelize.query(`UPDATE products SET name = ? WHERE id=${id}`,
                    {replacements: [name]});   
                }
                if(description!=""){
                    db.sequelize.query(`UPDATE products SET description = ? WHERE id=${id}`,
                    {replacements: [description]});   
                }
                if(price!=""){
                    db.sequelize.query(`UPDATE products SET price = ? WHERE id=${id}`,
                    {replacements: [price]});   
                }
                if(image!=""){
                    db.sequelize.query(`UPDATE products SET image = ? WHERE id=${id}`,
                    {replacements: [image]});   
                }
                if(stock!=""){
                    db.sequelize.query(`UPDATE products SET stock = ? WHERE id=${id}`,
                    {replacements: [stock]});   
                }
                res.status(200).json({msj:"Actualización exitosa"});      
            }
        })
    }
    else{
        res.json({msj: "Sin permiso"})
    }
})

// ELIMINAR PRODUCTO
router.delete('/:id', security.autorizarUsuario, async (req,res)=>{
    const id = req.params.id;
    if(req.admin){
        await db.sequelize.query(`SELECT * FROM products WHERE id=${id}`,
            {type: db.sequelize.QueryTypes.SELECT})
        .then(response=>{
            if (response.length == 0){
                res.status(404).json({msj: 'Producto no encontrado'});
            }
            else{
                db.sequelize.query(`DELETE FROM products WHERE id=?`,
                {replacements: [id]})
                .then(response=>{
                    res.status(200).json({msj: "Producto eliminado"});
                })        
            }
        })
    }
    else{
        res.json({msj: "Sin permiso"})
    }
})

// AGREGAR UN PRODUCTO A FAVORITOS
router.post("/:id", security.autorizarUsuario, async (req,res)=>{
    const id = req.params.id; 
    await db.sequelize.query(`SELECT * FROM products WHERE id=${id}`,
        {type: db.sequelize.QueryTypes.SELECT})
    .then(response=>{
        if (response.length == 0){
            res.status(404).json({msj: 'Producto no encontrado'});
        }
        else{
            db.sequelize.query("INSERT INTO favorites VALUES (?, ?, ?)",
                {replacements: [null, req.id, id]})
            .then(response=>{
                    res.status(201).json({msj:"Producto añadido"});
            })
        }
    }) 
})


module.exports = router;