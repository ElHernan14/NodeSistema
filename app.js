const express = require('express')
const app = express() 

app.set('view engine','ejs')

app.use(express.urlencoded({extended:false}))

//import the router
app.use('/',require('./router/router'))

app.listen(5000, ()=>{
    console.log('Server running in port: 5000')
});