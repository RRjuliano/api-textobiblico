const Consulta = require('../models/consulta.model.js')
const mongoose = require('mongoose')


const {ERlivro, ERnum, ERcpvs, base, lvs_orig, lvs, lvs_abre, lvs_ace, n_caps, n_vers, conteudo} = require('../data/data.js')


const newConsulta = async (req, res) => {

    const input = req.body.input
    console.log(req.body)
    if(!input || typeof input != "string"){
        console.log({response: false})
        return res.status(404).json({ success: false, message:'erro no formato da request'})
    }
    try {
        const response = findRefAll(input)
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
            item.push(parseInt(num))
            i3 = i3.substr(proc3.index + num.length)
        }
    } while (proc3 && item.length < 5)
      if (item.length > 2) {
        if (n_caps[ind_livro] < item[2]) {
            return ["Capitulo inválido !!!", iEnd]
        }
        if (item.length > 3) {
            if (n_vers[ind_livro][item[2] - 1] < item[3]) {
                return ["Número do versiculo inválido !!!", iEnd]
            }
            if (item.length == 5) {
                if (item[4] <= item[3] || n_vers[ind_livro][item[2] - 1] < item[4]) {
                    return ["Intervalo de versiculos inválido !!!", iEnd]
                }
            }
        }
    } else {
        return ["Apenas o livro, qual capitulo??", iEnd]
    }
    return [item, iEnd]
}
function process(item) {
    let url = base + lvs_ace[item[0]] + '_' + item[2]
    let ref = lvs_orig[item[0]] + ' ' + item[2]
    let tex = conteudo[item[0]][item[2] - 1][0]
    let cod = item[0] + '_' + (item[2] - 1)
    tex = tex.substr(tex.match(/ /).index) + ' ...'
    let cap = true
    switch (item.length) {
    case 4:
        cap = false
        ref += " : " + item[3];
        tex = conteudo[item[0]][item[2] - 1][item[3] - 1];
        tex = tex.substr(tex.match(/ /).index);
        cod += "_" + (item[3]-1)
        break;
    case 5:
        cap = false
        ref += " : " + item[3] + " - " + item[4];
        tex = '';
        cod += "_" + (item[3]-1) + "_" + (item[4]-1)
        let vs = item[3]-1;
        do {
            let t = conteudo[item[0]][item[2] - 1][vs];
            t = t.substr(t.match(/ /).index);
            tex += t + ' ';
            vs++
        } while (vs <= item[4] - 1);
        break;
    }
    return [ref, url, tex, cod, cap]
}
function findRefAll(input) {
    let inp = input
    let response = []
    do {
        let[i,iEnd] = findRef(inp)
        if (typeof(i) != 'string') {
			let[ref,url,tex,cod] = process(i)
            response.push({"text":tex, "ref": ref, "url": url, "cod": cod})
        }
        inp = inp.substr(iEnd)
    } while (inp.length > 0)
    return response.length==0?false:response
}

module.exports = {newConsulta, getConsulta}