const express = require('express')

const router = express.Router()
const {newBibliaAcf, getBibliaAcf} = require('../controllers/biblia-acf.controller.js')

router.post('/new', newBibliaAcf)
router.get('/:cod', getBibliaAcf)
router.get('/', (req, res) => {res.send(
    '<br><br><br><h2 style="width: 100%; height: 100%; text-align:center;">Bem-vindo a biblia-acf route !<h2/>'
)})

module.exports = router