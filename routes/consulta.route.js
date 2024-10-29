const express = require('express')

const router = express.Router()
const {newConsulta, getConsulta} = require('../controllers/consulta.controller.js')

router.post('/new', newConsulta)
router.get('/:id', getConsulta)
router.get('/', (req, res) => {res.send(
    '<br><br><br><h2 style="width: 100%; height: 100%; text-align:center;">Bem-vindo a search route !<h2/>'
)})

module.exports = router