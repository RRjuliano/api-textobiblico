const { base, lvs_orig, lvs, lvs_abre, lvs_ace } = require('../data/data.js')


async function excep_treat(str){ //treatment initial

    //exceptions - livro jó, salmo e proverbio, cantares de salomao e lamentaçoes de jeremias
    //treatment - tolowercase, numeros romanos, acentos em vogais, cedilha

    const str_treated = str.replaceAll(/\bIII/g, "   3").replaceAll(/\bII/g, "   2").replaceAll(/\bI/g, "   1")
        .toLowerCase().replaceAll('jó', 'joh')
        .replaceAll('1saias', 'isaias').replaceAll(/1s\b/g, 'is')
        .replaceAll('á', 'a').replaceAll('é', 'e').replaceAll('í', 'i').replaceAll('ó', 'o').replaceAll('ú', 'u')
        .replaceAll('â', 'a').replaceAll('ã', 'a').replaceAll('ê', 'e').replaceAll('ô', 'o').replaceAll('õ', 'o').replaceAll('ç', 'c')
        .replaceAll("salmo ", 'salmos ').replaceAll("proverbio ", 'proverbios ')
        .replaceAll('cantares de salomao', 'cantares').replaceAll('lamentacoes de jeremias', 'lamentacoes')

    return str_treated
}
async function execAll(str){ //find all reference

    const reg = /(?<num>\d?)\s?(?<liv>[A-Z]{2,})[\D\W]{0,3}(?<cap>\d{1,3})([\D\W]{1,3}(?<vers>\d{1,3}))?([\D\W]{1,3}(?<vers_>\d{1,3}))?/i
    let index = 0
    let list = []
    do {

        let res = reg.exec(str.substring(index))
        if(!res){ break }

        index += res.index + res[0].length

        const g = res.groups
        if ( g.vers_ && (Number(g.vers_) <= g.vers)){ index -= g.vers_.length ; g.vers_ = null }
        list.push(g)

    } while ( index !== str.length )
    
    console.log(list)
    return list.length==0?false:list
}

async function getText(cod){ //called getBibliaAcf(cod)
    const result = await getBibliaAcf(cod)
    return result.success? { tex: result.value.value, length: result.value.length } : ''
}
async function getBibliaAcf(cod) { //request to api https://api-textobiblico.vercel.app
    const response = await fetch(`https://api-textobiblico.vercel.app/api/biblia-acf/${cod}`) //http://localhost:5000
    return await response.json()                              
}
async function process(i) { //called getText

    //não aceita capitulo ou versiculo igual a 0, retorna false
    if(Number(i.cap) == 0 || (i.vers && Number(i.vers) == 0)) { return false }

    //indice do livro, verifica por nome ou abreviatura
    let nLiv = lvs.indexOf(i.liv)
    if (nLiv == -1) { nLiv = lvs_abre.indexOf(i.liv) }

    //verifica se há numero do livro (pular indice), observar livro joao e cartas joao  (mesmo nome - pular indice)
    if(nLiv != -1 && i.num){ 
        if(Number(i.num) > 1) { nLiv = lvs.indexOf(lvs[nLiv], nLiv+1) }
        if(nLiv != -1 && i.num == '3') { nLiv = lvs.indexOf(lvs[nLiv], nLiv+1) }
        if(nLiv != -1 && lvs[nLiv] == 'joao') { nLiv = lvs.indexOf(lvs[nLiv], nLiv+1) }
    }

    //se não encontrar indice retorna false
    if(nLiv == -1) { return false }

    //cap
    const url = base + lvs_ace[nLiv] +'_' + i.cap
    let ref = '( ' +lvs_orig[nLiv] +' ' + i.cap
    let cod = nLiv + '_' + (Number(i.cap)-1)

    if(i.vers !== undefined) { 
        if(i.vers_ == undefined){ //vers
            ref += ":" + i.vers
            cod += "_" + (Number(i.vers)-1)
        } else { //interval vers
            cod += "-" + (Number(i.vers)-1) + "-" + (Number(i.vers_)-1)
        }
    }

    const result = await getText(cod)
    if (!result) { return false }
    let tex = result.tex
    const length = result.length
    if(i.vers !== undefined && i.vers_ != undefined){ //interval vers
        ref += length != 1? ":" + i.vers + "-" + (Number(i.vers)+length-1) : ":" + i.vers  
    }

    ref += ' ACF )' //model bible

    //elimina primeiro caracter (espaço), se for vers - elimina o número
    tex = tex.substring(1)
    tex = (length == 1) ? tex.substring(tex.match(/ /).index+1) : tex

    return {"text": tex, "ref": ref, "url": url, "cod": cod}
}

async function main(str) { //called excep_treat, execAll, process
    
    //run execAll - loop regex exec to find occurrences
    const list = await execAll( await excep_treat(str)) //before run excetions
    if(!list){ return false }

    let proc = []
    for (e of list){ proc.push( await process(e) ) }
    proc = proc.filter( (x) => x !== false )
    console.log(proc)
    return proc.length==0?false:proc
}

module.exports = {main}