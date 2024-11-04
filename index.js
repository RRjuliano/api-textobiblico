require('dotenv').config()
const express = require('express')
const connectDB = require("./config/db.js");
const consultaRoute = require('./routes/consulta.route.js')
const bibliaAcfRoute = require('./routes/biblia-acf.route.js')
const cors = require('cors')

const app = express()

//midlleware
app.use(cors({ origin: ["https://textobiblico.vercel.app"], credentials: false }))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/public', express.static(__dirname + '/public'))

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${req.ip}`)
    next()
})

//routes
app.use('/api/search', consultaRoute)
app.use('/api/biblia-acf', bibliaAcfRoute)
app.get('/', (req, res) => {res.send(
    `<br><br><br><div style="width: 100%; height: 100%; text-align:center;">
        <h2>API is activated !</h2>
        <p>/api/search</p>
        <p>/api/search/new</p>
        <p>/api/search/:id</p>
        <p>/api/biblia-acf</p>
        <p>/api/biblia-acf/new</p>
        <p>/api/biblia-acf/:cod</p>
    <div/>`
)}) //res.sendFile(__dirname + '/views/index.html')})

//server
//connectDB()
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server is running : http://localhost:${port}`)
})
