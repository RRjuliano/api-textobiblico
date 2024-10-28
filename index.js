require('dotenv').config()
const express = require('express')
const connectDB = require("./config/db.js");
const consultaRoute = require('./routes/consulta.route.js')
const app = express()

//midlleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/public', express.static(__dirname + '/public'))

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${req.ip}`)
    next()
})

//routes
app.use('/api/search', consultaRoute)
app.get('/', (req, res) => {'API is activated !'})//res.sendFile(__dirname + '/views/index.html')})

//server
const port = process.env.PORT || 3000
app.listen(port, () => {
    connectDB()
    console.log(`Server is running : http://localhost:${port}`)
})