const { json } = require('express')
const BibliaAcf = require('../models/biblia-acf.model.js')

const getBibliaAcf = async(req, res) => {

    const {cod} = req.params
    
    const query = async () => {
        
        //match to verify if CHAPTER or RANGE VERSE
        const cap = cod.match(/^(?<lv>\d{1,2})_(?<cap>\d{1,3})$/)
        const interval = cod.match(/^(?<lv>\d{1,2})_(?<cap>\d{1,3})(-(?<vers>\d{1,3})-(?<vers_>\d{1,3}))/)

        //all entries with same BOOK(lv) & CHAPTER(cap), limit to interval, and skip to correct initial
        if( interval ){
            const reg = new RegExp(`\\b${interval.groups.lv}_${interval.groups.cap}_\\d+\\b`)
            const limit = (interval.groups.vers_ > interval.groups.vers)? interval.groups.vers_-interval.groups.vers+1 : 1
            const skip = interval.groups.vers
            return await BibliaAcf.find({cod: { $regex: reg } }).limit(limit).skip(skip)
        }
        //all entries with same BOOK(lv) & CHAPTER(cap)
        if ( cap ){
            const reg = new RegExp(`\\b${cap.groups.lv}_${cap.groups.cap}_\\d+\\b`)
            return await BibliaAcf.find({cod: { $regex: reg } })
        }

        //when only one vers, insert into array for correct length
        const vers = await BibliaAcf.findOne({cod: cod})
        return vers?[vers]:false
    }

    try {
        const data = await query()
        if(!data || data.length == 0){ return res.status(404).json({ success: false, message: "Código inválido"} )}
        res.status(200).json({ success: true, value: { cod: cod, value : data.reduce( (accum, curr) => accum + " " +curr.value, '' ) }})
    } catch (error){
        res.status(500).json({ success: false, message:'server error' })
    }
}

module.exports = { getBibliaAcf }