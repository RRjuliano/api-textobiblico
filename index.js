const express = require('express')
const mongoose = require('mongoose')
const consultaRoute = require('./routes/consulta.route.js')
const bibliaAcfRoute = require('./routes/biblia-acf.route.js')
const cors = require('cors')
const app = express()
require('dotenv').config()

//midlleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: ['http://localhost:5173', 'https://textobiblico.vercel.app'],
    credentials: true
}))

//app.use('/public', express.static(__dirname + '/public'))
//app.use((req, res, next) => {
//    console.log(`${req.method} ${req.path} - ${req.ip}`)
//    next()
//})

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

//connectDB()

//connection database
async function main() { await mongoose.connect(process.env.MONGO_URI) }
main().then(() => console.log("Mongodb connect successfully!")).catch(err => console.log(err));

//server
const port = process.env.PORT || 5000
app.listen(port, () => { console.log(`Server is running : http://localhost:${port}`) })

//const CONNECTION_URL = process.env.
//const PORT = process.env.PORT|| 5000;

//mongoose.connect(CONNECTION_URL)
//  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
//  .catch((error) => console.log(`${error} did not connect`))
