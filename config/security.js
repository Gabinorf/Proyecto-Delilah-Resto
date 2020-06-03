const db = require('../config/database');
const jwt = require('jsonwebtoken');
const firma_jwt = 'secret_password';
const bcrypt = require('bcrypt');


// ENCRIPTA CONTRASEÑA EN BASE DE DATOS
const encryptPassword = async (password)=>{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash
};
const comparePassword = async (password, savedPassword)=>{
    try{
        let result = bcrypt.compare(password, savedPassword);
        return result
    }
    catch(error){
        console.log(error)
    }
};

//  VALIDAR USUARIO
const validarUsuario = async (req,res,next) => {
    let {username, email, password} = req.query;
    try{
        let result = await db.sequelize.query(`SELECT * FROM users WHERE username ='${username}' OR email='${email}'`,
            {type: db.sequelize.QueryTypes.SELECT})
            .then(response=>{
                return response
            });       
        const verify = await comparePassword(password, result[0].password);
        if(username){
            if( (result[0].username.toLowerCase() == username.toLowerCase()) && (verify) ){
                let token = await jwt.sign(result[0], firma_jwt);
                res.status(200).json({token: token})
            }
            else{
                //Contraseña incorrecta
                res.status(401).json({msj: "Usuario/contraseña incorrecto"})
            }
        }
        if(email){
            if( (result[0].email.toLowerCase() == email.toLowerCase()) && (verify) ){
                let token = await jwt.sign(result[0], firma_jwt);
                res.status(200).json({token: token})
            }
            else{
                //Contraseña incorrecta
                res.status(401).json({msj: "Usuario/contraseña incorrecto"})
            }
        }   
    }
    catch{
        //Usuario o email incorrecto
        res.status(401).json({msj: "Usuario/contraseña incorrecto"})
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

module.exports = {autorizarUsuario, validarUsuario, encryptPassword, comparePassword};
