const { base, lvs_orig, lvs, lvs_abre, lvs_ace } = require('../data/data.js')

async function execAll(str){

    let string = str.toLowerCase().replaceAll("I ", " 1 ").replace("II", " 2 ").replaceAll('á', 'a').replaceAll('é', 'e').replaceAll('í', 'i').replaceAll('ó', 'o').replaceAll('ú', 'u').replaceAll('â', 'a').replaceAll('ã', 'a').replaceAll('ê', 'e').replaceAll('ô', 'o').replaceAll('õ', 'o').replaceAll('ç', 'c')
    const reg = /(?<num>\d?)\s?(?<liv>[A-Z]+)[\s\W]*(?<cap>\d+)[\s\W]*(?<vers>\d+)?[\s\W]*(?<vers_>\d+)?/i
    let index = 0
    let list = []
    do {

        let res = reg.exec(string.substring(index))
        if(!res){ break }

        index += res.index + res[0].length

        const g = res.groups
        if (g.vers && g.vers_ && (g.vers_ <= g.vers)){ index -= g.vers_.length ; g.vers_ = null }
        list.push(g)

    } while ( index !== string.length )
    
    console.log(list)
    return list.length==0?false:list
}

async function getText(cod){ //called getBibliaAcf(cod)
    const result = await getBibliaAcf(cod)
    const tex = result.success? result.value.value : ''
    return tex
}
async function getBibliaAcf(cod) {
    let response = await fetch(`https://api-textobiblico.vercel.app/api/biblia-acf/${cod}`)
    let data = await response.json()
    return data                              
}
async function process(i) {

    const liv = i.liv
    let nLiv = lvs.indexOf(liv)
    let tipo = "nome"
    
    if (nLiv == -1) {
        nLiv = lvs_abre.indexOf(liv)
        tipo = "abrev"
    }

    if(nLiv == -1) { return false }

    const url = base + lvs_ace[nLiv] + '_' + i.cap
    let ref = lvs_orig[nLiv] + ' ' + i.cap
    let cod = nLiv + '_' + (Number(i.cap)-1)
    let cap = true
    let result = ''
    let tex = ''
    let cods = []

    if(i.vers === undefined){ //cap
        console.log(cod)
        result = await getBibliaAcf(cod)
        tex = result.success? result.value.value : ''
    } else { 
        if(i.vers_ == undefined){ //vers
            cap = false
            ref += " : " + i.vers
            cod += "_" + (Number(i.vers)-1)
            console.log(cod)
            result = await getBibliaAcf(cod)
            tex = result.success? result.value.value : ''
        } else { //interval vers
            cap = false
            ref += " : " + i.vers + " - " + i.vers_
            cod += "-" + (Number(i.vers)-1) + "-" + (Number(i.vers_)-1)
            console.log(cod)
            result = await getBibliaAcf(cod)
            tex = result.success? result.value.value : ''
        }
    }
    ref += ' ARC'

    tex = tex.substring(1)
    tex = (( i.vers_ == undefined) && (i.vers != undefined)) ? tex.substring(tex.match(/ /).index+1) : tex

    return {"text": tex, "ref": ref, "url": url, "cod": cod}
}

async function main(str) {
    
    //function exec of object regex to find referencias
    const list = await execAll(str)
    if(!list){ return false }

    let proc = []
    for (e of list){ proc.push( await process(e) ) }
    console.log(proc)
    return proc.length==0?false:proc
}

module.exports = {main}