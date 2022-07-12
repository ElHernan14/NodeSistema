const mysql = require('mysql')

const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    pass:  process.env.DB_PASS,
    database:  process.env.DB_DATABASE
})

conexion.connect((error) =>{
    if(error){
        console.log('The connection error is: '+error)
        return
    }
    console.log('Conectado a la database MYSQL!')
})

module.exports = conexion