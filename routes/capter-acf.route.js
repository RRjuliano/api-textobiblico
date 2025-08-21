const express = require('express')

const router = express.Router()
const {getCapterAcf} = require('../controllers/capter-acf.controller.js')

router.get('/:cod', getCapterAcf)
router.get('/', (req, res) => {res.send(
    '<br><br><br><h2 style="width: 100%; height: 100%; text-align:center;">Bem-vindo a capterAcf route !<h2/>'
)})

module.exports = router