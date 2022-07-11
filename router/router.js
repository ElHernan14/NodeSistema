const express = require('express')
const router = express.Router() 

//Invoke the database connection
const conexion = require('../database/db')

//To invoke the methods for the CRUD of users
const userController = require('../controllers/userController') 

router.get('/', (req,res) =>{
    //res.send('Hello Mundo')
    conexion.query('SELECT * FROM usuario', (error,results) =>{
        if(error){
            throw error;
        }else{
            console.log(results)
            res.render('index',{
                results
            })
        }
    })
})

//to invoke Create methods
router.get('/create', (req,res) =>{
    res.render('create')
})
 
router.post('/save', userController.save)

//to invoke Edit methods
router.get('/edit/:id', (req,res) =>{
    const id = req.params.id
    conexion.query('SELECT * FROM usuario WHERE idUsuario = ?',[id],(error, results) => {
        if(error){
            console.error(error)
            res.send(error)
        }else{
            console.log(results)
            res.render('edit',{
                user:results[0]
            })
        }
    })
})

router.post('/update', userController.update)

//To invoke DELETE method
router.get('/delete/:id', (req,res) =>{
    const id = req.params.id
    conexion.query('DELETE FROM usuario WHERE idUsuario = ?',[id],(error, results) => {
        if(error){
            throw error;
        }else{
            console.log(results)
            res.redirect('/')
        }
    })
})

module.exports = router;