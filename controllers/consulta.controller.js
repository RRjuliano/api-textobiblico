const Consulta = require('../models/consulta.model.js')
const mongoose= require('mongoose')

//const {ERlivro, ERnum, ERcpvs, base, lvs_orig, lvs, lvs_abre, lvs_ace, n_caps, n_vers} = require('../data/data.js')
const {main} = require('../machine/machine.js')


const newConsulta = async (req, res) => {

    const input = req.body.input
    console.log(req.body)
    if(!input || typeof input != "string"){
        console.log({response: false})
        return res.status(404).json({ success: false, message:'erro no formato da request'})
    }
    try {
        const response = await main(input) //findRefAll
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

function findRef(input) {
    let i1 = input.replace("II ", " 2 ")
    i1 = i1.replace("I ", " 1 ")
    i1 = i1.toLowerCase().replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u').replace('â', 'a').replace('ã', 'a').replace('ê', 'e').replace('ô', 'o').replace('õ', 'o').replace('ç', 'c')
    let item = []
    let iEnd = 0
    ///////////////////////////proc1 - livro
    let proc1 = i1.match(ERlivro)
    if (!proc1) {
        iEnd = input.length
        return ["Livro não encontrado !!!", iEnd]
    }
    let livro = proc1[0]
    iEnd = proc1.index + livro.length

    let ind_livro = lvs.indexOf(livro)
    let tipo = "nome"
    if (ind_livro == -1) {
        ind_livro = lvs_abre.indexOf(livro)
        tipo = "abrev"
    }
    if (livro == 'jo' && input.toLowerCase().substring(proc1.index, proc1.index+2) == 'jó') {
        ind_livro = lvs.indexOf('jó')
        livro = 'jó'
        tipo = "nome"
    }
    if(livro == "salmo"){
        ind_livro = lvs.indexOf('salmos')
        livro = 'salmos'
        tipo = "nome"
        iEnd += 1
    }
    if(livro == "proverbio"){
        ind_livro = lvs.indexOf('proverbios')
        livro = 'proverbios'
        tipo = "nome"
        iEnd += 1
    }
    if (ind_livro == -1) {
        return ["Livro inválido !!!", iEnd]
    }
    ////////////////////////////proc2 - numero do livro
    let i2 = i1.substring(0, proc1.index)
    let proc2 = i2.match(ERnum)
    if (proc2) {
        let num = proc2[0]
        let q = lvs
        if (tipo == "abrev") {
            q = lvs_abre
        }
        if (num <= 3 && num > 0) {
            if (num > 1) {
                ind_livro = q.indexOf(livro, ind_livro + 1)
            }
            if (num > 2) {
                ind_livro = q.indexOf(livro, ind_livro + 1)
            }
            if (livro == 'joao' || livro == 'jo') {
                ind_livro = q.indexOf(livro, ind_livro + 1)
            }
        } else {
            return ["Número do Livro inválido !!!", iEnd]
        }
        item.push(ind_livro)
        item.push(parseInt(num))
    } else {
        item.push(ind_livro)
        item.push(null)
    }
    if (ind_livro == -1) {
        return ["Número do Livro inválido !!!", iEnd]
    }
    ///////////////////////////proc3 - capitulo e versiculos 
    let i3 = i1.substr(proc1.index + livro.length)
    procLetra = i3.match(ERlivro)
    if (procLetra) {
        i3 = i3.substr(0, procLetra.index)
    }
    do {
        proc3 = i3.match(ERcpvs)
        if (proc3) {
            let num = proc3[0]
            iEnd += proc3.index + num.length
            item.push(parseInt(num)-1)
            i3 = i3.substr(proc3.index + num.length)
        }
    } while (proc3 && item.length < 5)
      if (item.length > 2) {
        if (n_caps[ind_livro] <= item[2]) {
            return ["Capitulo inválido !!!", iEnd]
        }
        if (item.length > 3) {
            if (n_vers[ind_livro][item[2]] < item[3]) {
                return ["Número do versiculo inválido !!!", iEnd]
            }
            if (item.length == 5) {
                if (item[4] <= item[3] || n_vers[ind_livro][item[2]] < item[4]) {
                    return ["Intervalo de versiculos inválido !!!", iEnd]
                }
            }
        }
    } else {
        return ["Apenas o livro, qual capitulo??", iEnd]
    }
    return [{"lv": item[0], "nLv": item[1], "cap": item[2], "vers": item[3], "versI": item[4]}, iEnd]
}
async function process(i) {
    const url = base + lvs_ace[i.lv] + '_' + (i.cap+1)
    let ref = lvs_orig[i.lv] + ' ' + (i.cap+1)
    let cod = i.lv + '_' + i.cap
    let cap = true
    let tex = ''
    if(i.vers === undefined){ //cap
        const end = n_vers[i.lv][i.cap]
        let c = 0
        var cods = []
        do {
            cods.push(`${i.lv}_${i.cap}_${c}`)
            c++
        } while (c < end)
    } else { 
        if(i.versI === undefined){ //vers
            cap = false
            ref += " : " + (i.vers+1)
            var cods = [`${i.lv}_${i.cap}_${i.vers}`]
            cod += "_" + (i.vers)
        } else { //int. vers
            cap = false
            ref += " : " + (i.vers+1) + " - " + (i.versI+1)
            cod += "_" + i.vers + "_" + i.versI
            let vs = i.vers
            var cods = []
            do {
                cods.push(`${i.lv}_${i.cap}_${vs}`)
                vs++
            } while (vs <= i.versI)
        }
    }
    
    ref += ' ARC'

    async function getBibliaAcf(cod) {
        let response = await fetch(`https://api-textobiblico.vercel.app/api/biblia-acf/${cod}`)
        let data = await response.json()
        return data                              
	}

    async function getText(cods) {

        async function executeQueue() {
            let arr = []
            for (let promiseFunc of promises) {
                const result = await promiseFunc()
                if(result.success) { arr.push(result.value.value) }
            }
            return arr.join(' ')
        }

        let promises = []
        cods
            .map((cod)=> {
                promises.push(() => new Promise(resolve => setTimeout(() => resolve(getBibliaAcf(`${cod}`)), 5)))
            })
        const text = await executeQueue()
        return text
    }

    tex = await getText(cods)
    tex = (( i.versI === undefined) && (i.vers !== undefined)) ? tex.substring(tex.match(/ /).index) : tex

    return {"text": tex, "ref": ref, "url": url, "cod": cod}
}
async function findRefAll(input) {
    let inp = input
    let response = []
    do {
        let[i,iEnd] = findRef(inp)
        if (typeof(i) != 'string') {
            console.log(i)
            response.push(await process(i))
        }
        inp = inp.substr(iEnd)
    } while (inp.length > 0)
    return response.length==0?false:response
}


module.exports = {newConsulta, getConsulta}