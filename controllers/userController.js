//Invoke the database connection
const conexion = require('../database/db')

//procedure to save
exports.save = (req,res) =>{
    const email = req.body.email
    const name = req.body.nombre
    const apellido = req.body.apellido
    const area = req.body.area

    //console.log(email + " - " + name + " - " + apellido + " - " + area)
    conexion.query('INSERT INTO usuario SET ?',{mail:email,nombre: name, apellido:apellido, areaDeTrabajo: area}, (error,results) =>{
        if(error) {
            console.log(error)
        }else{
            console.log('Usuario guardado correctamente')
            res.redirect('/');
        }
    })
}

exports.update = (req,res) =>{
    const email = req.body.email
    const name = req.body.nombre
    const apellido = req.body.apellido
    const area = req.body.area
    const id = req.body.id

    //console.log(email + " - " + name + " - " + apellido + " - " + area)
    conexion.query('UPDATE usuario SET ? WHERE idUsuario = ?',[{mail:email,nombre: name, apellido:apellido, areaDeTrabajo: area},id], (error,results) =>{
        if(error) {
            console.log(error)
        }else{
            console.log('User updated successfully')
            res.redirect('/');
        }
    })
}