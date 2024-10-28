const express = require('express')

const router = express.Router()
const {newBibliaAcf, getBibliaAcf} = require('../controllers/biblia-acf.controller.js')

router.post('/new', newBibliaAcf)
router.get('/:id', getBibliaAcf)
router.get('/', send('bem-vido a api/biblia-acf route'))

module.exports = router