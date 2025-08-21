const { json } = require('express')
const capterAcf = require('../models/capter-acf.model.js')

const getCapterAcf = async(req, res) => {

    const {cod} = req.params

    try {
        const capter = await capterAcf.findOne({cod: cod})
        if(!capter || capter.length == 0){ return res.status(404).json({ success: false, message: "Código inválido"} )}
        res.status(200).json({ success: true, value: capter })
    } catch (error){
        res.status(500).json({ success: false, message:'server error' })
    }
}

module.exports = { getCapterAcf }