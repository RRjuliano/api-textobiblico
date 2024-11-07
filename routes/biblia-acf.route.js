const express = require('express')

const router = express.Router()
const {getBibliaAcf} = require('../controllers/biblia-acf.controller.js')

router.get('/:cod', getBibliaAcf)
router.get('/', (req, res) => {res.send(
    '<br><br><br><h2 style="width: 100%; height: 100%; text-align:center;">Bem-vindo a biblia-acf route !<h2/>'
)})

module.exports = router