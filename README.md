# Proyecto Delilah Restó

El código que vamos a encontrar en éste repositorio corresponde al tercer proyecto de Acámica Desarrollo Web Fullstack.
El objetivo es diseñar y desarrollar una API que respete las consignas, el proyecto solo contempla la creación de la API y consumo por algún cliente HTTP, como puede ser Postman.
Dentro de los recursos encontramos las vistas de UI que corresponden a los diferentes flujos y endpoints del proyecto.

## Recursos disponibles

#### Especificación de la API
En el archivo `spec.yaml` se encuentra la especificación de la Api, endpoints y modelo de datos.

#### Modelo de base de datos
Dentro de la carpeta `db` se encuentra el archivo `setup.js` que cuenta con la estructura de la base de datos. También podemos encontrar `insert.js` con algunos datos de ejemplo.

Antes de ejecutar el proyecto se recomienda ejecutar `npm run setup` y luego `npm run insert` para realizar las migraciones.
#### Vistas
Dentro de la carpeta `views` encontramos las vistas de UI que corresponden a los diferentes flujos y endpoints del proyecto.

#### Servidor
Se puede iniciar el servidor ejecutando `npm run ini`

## Recomendaciones
1- Tener instalado `Node.js`  
2- Tener instalado `XAMPP` o algún sistema de gestión de bases de dato MySQL.  
3- Tener instalado `Postman` o cualquier entorno que permita el consumo de la API como cliente HTTP.

## Instrucciones
1- Clonar el repositorio   
2- Instalar las dependencias necesarias, especificadas en el archivo `package.json`  
3- Ejecutar `npm run setup`  
4- Ejecutar `npm run insert`  
5- Ejecutar `npm run ini`
