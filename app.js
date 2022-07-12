const express = require('express')
const app = express() 
const path = require('path')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const multer = require('multer')

//middlewares
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname).toLocaleLowerCase());
    }
})

app.use(multer({
    storage,
    dest: path.join(__dirname, 'public/uploads'),
    limits: {fileSize: 2 * 1024 * 1024},  // 2 MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/
        const mimetype = filetypes.test(file.mimetype)
        const extname = filetypes.test(path.extname(file.originalname))
        if (mimetype && extname) {
            return cb(null, true)
        }
        cb("Error: File must be an valid image")
    }
}).single('image'));

dotenv.config({path: './env/.env'})

app.set('view engine','ejs')

app.use(express.urlencoded({extended:false}))
app.use(cookieParser())

//import the router
app.use('/',require('./router/router'))

app.use(express.static(path.join(__dirname, '/public')))

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log('Server running in port: ', PORT)
    console.log(process.env.DB_HOST,process.env.DB_USER,process.env.DB_PASSWORD,process.env.DB_DATABASE)
});