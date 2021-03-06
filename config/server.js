const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');


/********************************************************************************
        CONFIGURACIÓN
********************************************************************************/
app.set('port', process.env.PORT || 3000);


/********************************************************************************
        MIDDLEWARES
********************************************************************************/
app.use(bodyParser.json());


/********************************************************************************
        PATHS
********************************************************************************/
app.use('/users', require("../paths/users"));
app.use('/products', require("../paths/products"));
app.use('/orders', require("../paths/orders"));


/********************************************************************************
        INICIAR SERVIDOR
********************************************************************************/
app.listen(app.get('port'), () => {
        console.log("Servidor iniciado...");
});



