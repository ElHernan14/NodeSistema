//Invoke the database connection
const conexion = require('../database/db')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const {promisify} = require('util') 
const nodemailer = require('nodemailer')

//procedure to register
exports.register = async (req,res) =>{
    try {
        const email = req.body.email
        const name = req.body.nombre
        const apellido = req.body.apellido
        const pass = req.body.pass
        let passHash = await bcryptjs.hash(pass, 10)
        conexion.query('INSERT INTO usuario SET ?',{mail:email,nombre: name, apellido:apellido, password: passHash}, (error,results) =>{
            if(error) {
                res.render('register', {
                    alert: true,
                    alertMessage: 'This email already exists!'
                })
            }else{
                 //create email body
                 contentHTML = `
                 <h1>User Information</h1>
                 <ul>
                     <li>Username: ${name} </li>
                     <li>User Email: ${email} </li>
                 </ul>
                `;
                //set email configuration, sender and server
                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    host: 'mail.gustabin.com',
                    port: 587,
                    secure: false, 
                    auth: {
                        user: 'hernanbonne98@gmail.com',
                        pass: 'ykulhmiwlybrlfnk'
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });

                //send email                
                const info =  transporter.sendMail({
                    from: "'Hernansito Server' <hernanbonne98@gmail.com>",
                    to: email,
                    subject: 'Probando Nodemailer Udemy',
                    html: contentHTML
                });

                console.log('Mail enviado')
                res.redirect('/');
            }
        })
    } catch (error) {
        console.error(error)
    }
}

//procedure to login
exports.login = async (req, res)=>{
    try {
        const email = req.body.email
        const pass = req.body.pass  
        console.log(email)      
        if(!email || !pass ){
            res.render('login',{
                alert:true,
                alertTitle: "Warning",
                alertMessage: "Enter your email and password",
                alertIcon:'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        }else{
            conexion.query('SELECT * FROM usuario WHERE mail = ?', [email], async (error, results)=>{
                if( results.length == 0 || ! (await bcryptjs.compare(pass, results[0].password)) ){
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Email or Password invalid",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'    
                    })
                }else{
                    //login OK
                    const id = results[0].idUsuario
                    const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_EXPIRATION_TIME
                    })
                    const cookiesOptions = {
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie('jwt', token, cookiesOptions)
                    res.render('login', {
                            alert: true,
                            alertTitle: "Successful connection",
                            alertMessage: "¡CORRECT LOGIN!",
                            alertIcon:'success',
                            showConfirmButton: false,
                            timer: 800,
                            ruta: '/'
                    })
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}

//procedure to authenticate
exports.isAuthenticated = async (req, res, next)=>{
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query('SELECT * FROM usuario WHERE idUsuario = ?', [decodificada.id], (error, results)=>{
                if(!results){return next()}

                row = results[0]
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    }else{
        res.redirect('/login')        
    }
} 

//procedure to logout
exports.logout = (req,res) =>{
    res.clearCookie('jwt')
    return res.redirect('/login')
}