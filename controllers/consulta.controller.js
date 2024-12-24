const Consulta = require('../models/consulta.model.js')
const mongoose= require('mongoose')

const {main} = require('../machine/machine.js')


const newConsulta = async (req, res) => {

    const input = req.body.input
    console.log(req.body)
    if(!input || typeof input != "string"){
        console.log({response: false})
        return res.status(404).json({ success: false, message:'erro no formato da request'})
    }
    try {
        const response = await main(input)
        const status = response?true:false
        if(!status){
            res.status(200).json({ success: false, message: 'nenhum texto encontrado'})
            return console.log({response: false})
        }

        const ip = req.connection.remoteAddress
        const consulta =  new Consulta({input, response, ip})
        const id = await consulta.save()
        console.log({response: true, count:consulta.response.length})
        res.status(200).json({ success: true, value: consulta._id})
    } catch (error){
        console.log({response: false})
        res.status(500).json({ success: false, message:'server error' })
    }
}
const getConsulta = async(req, res) => {

    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ success: false, message: "Id inválida"})
    }
    try {
        const consulta = await Consulta.findOne({ _id: id })
        if(!consulta){return res.status(404).json({ success: false, message: "Id inválida"})}
        res.status(200).json({ success: true, value: consulta })
    } catch (error){
        res.status(500).json({ success: false, message:'server error' })
    }
}

const updateConsulta = async (req, res) => {

}
const deleteConsulta = async(req, res) => {

}

module.exports = {newConsulta, getConsulta}