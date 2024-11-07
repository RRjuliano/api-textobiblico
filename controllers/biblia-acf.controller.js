const BibliaAcf = require('../models/biblia-acf.model.js')

const getBibliaAcf = async(req, res) => {

    const {cod} = req.params
    try {
        const ref = await BibliaAcf.findOne({ cod: cod })
        if(!ref){return res.status(404).json({ success: false, message: "Código inválido"})}
        res.status(200).json({ success: true, value: ref })
    } catch (error){
        res.status(500).json({ success: false, message:'server error' })
    }
}

module.exports = { getBibliaAcf }