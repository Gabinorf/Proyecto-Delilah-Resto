const db = require('../config/database');
const jwt = require('jsonwebtoken');
const firma_jwt = 'secret_password';


//  VALIDAR USUARIO
const validarUsuario = async (req,res,next) => {
    let {username, email, password} = req.body;
    try{
        let result = await db.sequelize.query(`SELECT * FROM users WHERE username ='${username}' OR email='${email}'`,
            {type: db.sequelize.QueryTypes.SELECT})
            .then(response=>{
                return response
            });   
        if( (result[0].username == username || result[0].email == email) && result[0].password == password ){
            let token = await jwt.sign(result[0], firma_jwt);
            res.status(200).json({token: token})
        }
        else{
            //Contraseña incorrecta
            res.status(400).json({msj: "Usuario/contraseña incorrecto"})
        }
    }
    catch{
        //Usuario incorrecto
        res.status(400).json({msj: "Usuario/contraseña incorrecto"})
    } 
    next()
}

//  AUTORIZAR USUARIO
const autorizarUsuario = async (req, res, next) => {
    let token = req.headers.authorization;
    try {
        decode = await jwt.verify(token, firma_jwt);

        if(decode){
            [req.id, req.name, req.admin] = [decode.id, decode.name, decode.admin];
            next();
        }else{
            throw "Sin acceso";
        }
    } catch (error) {
        res.status(401).json({msj: "Sin autorización"})
    }
}

module.exports = {autorizarUsuario,validarUsuario};
