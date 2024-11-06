const BibliaAcf = require('../models/biblia-acf.model.js')

const newBibliaAcf = async (req, res) => {

    const cod = req.body.cod
    const value = req.body.value
    console.log(req.body)
   
    if(!cod || typeof cod != "string" || !value || typeof value != "string"){
        console.log({response: false})
        return res.status(404).json({ success: false, message:'erro no formato da request', error: '1'})
    }
    try {
        const item =  new BibliaAcf({cod, value})
        const result = await item.save()
        console.log({response: true})
        res.status(200).json({ success: true, value: item, result: result})
    } catch (error){
        console.log({response: false})
        res.status(500).json({ success: false, message:'server error', error: '2'})
    }
}
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


module.exports = {newBibliaAcf, getBibliaAcf}