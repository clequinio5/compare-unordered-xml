const util = require('util')
const exec = util.promisify(require('child_process').execFile)

async function compareXML(path1, path2, outputPath) {
    const { stdout, stderr } = await exec('compare.bat', [path1, path2, outputPath])
    let error = stderr
    let [result, execTime, parseTimeFile1, parseTimeFile2, computingTime, writeTime] = stdout.split('\r\n').slice(2).map((el) => el.match(/: (\d+) ms/) ? el.match(/: (\d+) ms/)[1] : el)
    let obj = {
        execTime: execTime,
        pathFile1: path1,
        pathFile2: path2,
        parseTimeFile1: parseTimeFile1,
        parseTimeFile2: parseTimeFile2,
        computingTime: computingTime,
        writeTime: writeTime,
        error: error
    }
    if (result == "Difference detected!") {
        obj.isEqual = false
    } else if (result == "No difference!") {
        obj.isEqual = true
    } else {
        obj.isEqual = undefined
    }
    return obj
}

async function main() {
    let result = await compareXML('dataset/Acces_1.xml', 'dataset/Acces_2.xml', 'output/Acces_output.xml')
    console.log('isEqual: ' + result.isEqual)
    console.log('Temps d\'execution: ' + result.execTime + ' ms')
    console.log('Temps de comparaison: ' + result.computingTime + ' ms')
}

main()




