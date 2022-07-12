const express = require('express')
const router = express.Router() 
//Invoke the database connection
const conexion = require('../database/db')
//To invoke the methods for the CRUD of users
const userController = require('../controllers/userController') 
//To invoke the methods for the AUTH
const authController = require('../controllers/authController') 

router.get('/users', authController.isAuthenticated, (req,res) =>{
    //res.send('Hello Mundo')
    conexion.query('SELECT * FROM usuario', (error,results) =>{
        if(error){
            throw error;
        }else{
            if(row.areaDeTrabajo != null && (row.areaDeTrabajo == 'Administracion' || row.areaDeTrabajo == 'Gerencia')){
                res.render('users',{
                    results,
                    titleWeb: 'Users'
                })
            }else{
                res.render('index', {userName: row.nombre, image: row.imagen, titleWeb: 'Control Dashboard'})
            }
        }
    })
})

//to invoke Create methods
router.get('/createUser', authController.isAuthenticated, (req,res) =>{
    if(row.areaDeTrabajo != null && (row.areaDeTrabajo == 'Administracion' || row.areaDeTrabajo == 'Gerencia')){
        res.render('createUser',{titleWeb: 'Create User'})
    }else{
        res.render('index', {userName: row.nombre, image: row.imagen, titleWeb: 'Control Dashboard'})
    }
})
 
router.post('/saveUser', userController.saveUser)

//to invoke Edit methods
router.get('/editUser/:id', authController.isAuthenticated, (req,res) =>{
    const id = req.params.id
    conexion.query('SELECT * FROM usuario WHERE idUsuario = ?',[id],(error, results) => {
        if(error){
            console.error(error)
            res.send(error)
        }else{
            if(row.areaDeTrabajo != null && (row.areaDeTrabajo == 'Administracion' || row.areaDeTrabajo == 'Gerencia')){
                res.render('editUser',{
                    user:results[0],
                    titleWeb: 'Edit User'
                })
            }else{
                res.render('index', {userName: row.nombre, image: row.imagen, titleWeb: 'Control Dashboard'})
            }
        }
    })
})

router.post('/updateUser', userController.updateUser)

//To invoke DELETE method
router.get('/deleteUser/:id', (req,res) =>{
    const id = req.params.id
    conexion.query('DELETE FROM usuario WHERE idUsuario = ?',[id],(error, results) => {
        if(error){
            throw error;
        }else{
            console.log(results)
            res.redirect('/users')
        }
    })
})

//router for views
router.get('/', authController.isAuthenticated,(req,res) =>{
    res.render('index', {userName: row.nombre, image: row.imagen, titleWeb: 'Control Dashboard'})
})

router.get('/logout', authController.logout)

router.get('/login', (req,res) =>{
    res.render('login',{alert:false})
})

router.get('/register', (req,res) =>{
    res.render('register',{alert:false})
})

router.post('/register', authController.register)

router.post('/login', authController.login)

router.post('/upload/:id', (req,res) =>{
    const id = req.params.id
    const image = req.file.filename

    conexion.query('UPDATE usuario SET ? WHERE idUsuario = ?',[{imagen:image},id], (error,results) =>{
        if(error){
            console.error(error);
        }else{
            res.redirect('/editUser/'+id)
        }
    }) 
})

module.exports = router;