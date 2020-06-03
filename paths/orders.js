const express = require('express');
const router = express.Router();
const security = require('../config/security');
const db = require('../config/database');


// CREAR NUEVO PEDIDO
router.post("/", security.autorizarUsuario, async (req,res)=>{
    db.sequelize.query("INSERT INTO orders VALUES (?, ?, ?, ?, ?, ?, ?)",
        {replacements: [null, req.id, 0.00, "cash", "new", null, null]})
    .then(response=>{
        res.status(201).json({msj:"Pedido creado"});
    })
})

//  OBTENER LISTA DE PEDIDOS
router.get('/', security.autorizarUsuario, async (req, res) => {
    if(req.admin){
        if (req.query.userId){
            await db.sequelize.query(`SELECT * FROM orders WHERE user_id = ${req.query.userId}`,
            {type: db.sequelize.QueryTypes.SELECT})
            .then(response=>{
                if(response.length == 0){
                    res.status(404).json({msj: 'No se encontraron resultados'})
                }
                res.status(200).json(response)
            })    
        }
        else{
            db.sequelize.query(`SELECT * FROM orders`,
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

// AÑADIR PRODUCTO AL PEDIDO
router.post("/:id", security.autorizarUsuario, async (req,res)=>{
    const id = req.params.id;
    let result = await db.sequelize.query(`SELECT user_id FROM orders WHERE id=${id}`,
                {type: db.sequelize.QueryTypes.SELECT})
                .then(response=>{
                    return response[0]
            });

    if(result.user_id == req.id){
        const idProd = req.query.product;
        await db.sequelize.query(`SELECT * FROM products WHERE id=${idProd}`,
            {type: db.sequelize.QueryTypes.SELECT})
        .then(response=>{
            if (response.length == 0){
                res.status(404).json({msj: 'Producto no encontrado'});
            }
            else{
                db.sequelize.query("INSERT INTO order_products VALUES (?, ?, ?)",
                    {replacements: [null, id, idProd]})
                .then(response=>{
                        res.status(201).json({msj:"Producto añadido al pedido"});
                }) 
            }
        })
    }
    else{
        res.status(403).json({msj: "Sin permiso"})
    } 
})

// OBTENER PEDIDO POR ID
router.get("/:id", security.autorizarUsuario, async (req,res)=>{
    const id = req.params.id;
    let result = await db.sequelize.query(`SELECT user_id FROM orders WHERE id=${id}`,
        {type: db.sequelize.QueryTypes.SELECT})
    .then(response=>{
        if(response.length == 0){
            res.status(404).json({msj: 'Pedido no encontrado'})
        }
        return response[0]
    });
    if(result.user_id == req.id || req.admin){
        db.sequelize.query(`SELECT * FROM orders WHERE user_id = ${result.user_id}`,
            {type: db.sequelize.QueryTypes.SELECT})
        .then(async(response)=>{
            let list = await db.sequelize.query(`SELECT order_products.product_id, products.name, products.price FROM order_products
            JOIN products ON order_products.product_id = products.id WHERE order_id = ${response[0].id}`,
            {type: db.sequelize.QueryTypes.SELECT});
            res.status(200).json({data: response[0], content: list})
        })    
    }
    else{
        res.status(403).json({msj: "Sin permiso"})
    } 
})

// ELIMINAR PRODUCTO DEL PEDIDO
router.delete("/:id/:idP", security.autorizarUsuario, async (req,res)=>{
    const id = req.params.id,
        idP = req.params.idP;

    let result = await db.sequelize.query(`SELECT user_id FROM orders WHERE id=${id}`,
                {type: db.sequelize.QueryTypes.SELECT})
                .then(response=>{
                    if(response.length == 0){
                        res.status(404).json({msj: 'Pedido no encontrado'})
                    }
                    return response[0]
            });

    if(result.user_id == req.id){
        db.sequelize.query(`DELETE FROM order_products WHERE product_id=? && order_id=?`,
            {replacements: [idP, id]})
        .then((response=>{
            res.status(200).send("Producto eliminado del pedido")
        })) 
    }
    else{
        res.status(403).json({msj: "Sin permiso"})
    } 
})

// ELIMINAR PEDIDO
router.delete('/:id', security.autorizarUsuario, async (req,res)=>{
    const id = req.params.id;
    let result = await db.sequelize.query(`SELECT user_id, status FROM orders WHERE id=${id}`,
        {type: db.sequelize.QueryTypes.SELECT})
    .then(response=>{
        if(response.length == 0){
            res.status(404).json({msj: 'Pedido no encontrado'})
        }
        return response[0]
    });    
    if(result.user_id == req.id){
        if(result.status=="new"){
            db.sequelize.query(`DELETE FROM orders WHERE id=?`,
            {replacements: [id]})
            .then((response=>{
                res.status(200).send("Pedido eliminado")
            })) 
        }
        else{
            res.status(400).json({msj: "No se puede eliminar"})
        }
    }
    else{
        res.status(403).json({msj: "Sin permiso"})
    }
})

// CONFIRMAR PEDIDO
router.put("/:id", security.autorizarUsuario, async (req,res)=>{
    const id = req.params.id;
    let result = await db.sequelize.query(`SELECT user_id, status FROM orders WHERE id=${id}`,
        {type: db.sequelize.QueryTypes.SELECT})
    .then(response=>{
        if(response.length == 0){
            res.status(404).json({msj: 'Pedido no encontrado'})
        }
        return response[0]
    });
    if(result.user_id == req.id){
        if(result.status=="new"){
            db.sequelize.query(`UPDATE orders SET total = ?, payment = ?, status = ?, updated = ? WHERE id=${id}`,
                {replacements: [req.body.total, req.body.payment , "confirmed", null]})
            .then(response=>{
                res.status(201).json({msj:"Pedido confirmado"});
            })     
        }
        else{
            res.status(400).json({msj: "No se puede confirmar"})
        }
    }
    else{
        res.status(403).json({msj: "Sin permiso"})
    }
})    

// ACTUALIZAR ESTADO DEL PEDIDO
router.patch("/:id", security.autorizarUsuario, async (req,res)=>{
    const id = req.params.id;
    let result = await db.sequelize.query(`SELECT id, status FROM orders WHERE id=${id}`,
                {type: db.sequelize.QueryTypes.SELECT})
                .then(response=>{
                    if(response.length == 0){
                        res.status(404).json({msj: 'Pedido no encontrado'})
                    }
                    return response[0]
            });
    if(req.admin){
        db.sequelize.query(`UPDATE orders SET status = ? WHERE id=${id}`,
            {replacements: [req.query.status]})
            .then(response=>{
                res.status(200).json({msj:"Estado actualizado"});
            })    
    }
    else{
        res.json({msj: "Sin permiso"})
    }
})



module.exports = router;