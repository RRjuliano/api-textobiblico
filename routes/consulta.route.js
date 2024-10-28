const express = require('express')

const router = express.Router()
const {newConsulta, getConsulta} = require('../controllers/consulta.controller.js')

router.post('/new', newConsulta)
router.get('/:id', getConsulta)

module.exports = router