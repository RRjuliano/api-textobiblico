const BibliaAcf = require('../models/biblia-acf.model.js')
const mongoose = require('mongoose')


const newBibliaAcf = async (req, res) => {

    const cod = req.body.cod
    const value = req.body.value
    console.log(req.body)

    let counterrformat = 0
    let countsucess = 0
    let counterrserver = 0
    if(!cod || typeof cod != "string" || !value || typeof value != "string"){
        console.log({response: false})
        counterrformat += 1
        return res.status(404).json({ success: false, message:'erro no formato da request'})
    }
    try {
        const item =  new BibliaAcf({cod, value})
        const id = await item.save()
        countsucess += 1
        console.log({response: true})
        res.status(200).json({ success: true, value: item})
    } catch (error){
        counterrserver += 1
        console.log({response: false})
        res.status(500).json({ success: false, message:'server error' })
    }
}
const getBibliaAcf = async(req, res) => {

    const {cod} = req.params
    //if(!mongoose.Types.ObjectId.isValid(id)){
    //    return res.status(404).json({ success: false, message: "Id inválida"})
    //}
    try {
        const ref = await BibliaAcf.findOne({ cod: cod })
        res.status(200).json({ success: true, value: bibliaAcf })
    } catch (error){
        res.status(500).json({ success: false, message:'server error' })
    }
}


module.exports = {newBibliaAcf, getBibliaAcf}