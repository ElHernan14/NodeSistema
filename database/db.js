const mysql = require('mysql')

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    pass: '',
    database: 'aivon'
})

conexion.connect((error) =>{
    if(error){
        console.log('The connection error is: '+error)
        return
    }
    console.log('Conectado a la database MYSQL!')
})

module.exports = conexion