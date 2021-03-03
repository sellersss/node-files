const fs = require('fs')
const process = require('process')
const axios = require('axios')

function handleOutput(text, out) {
    if (out) {
        fs.writeFile(out, text, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing "${out}"\n${err}`)
                process.exit(1)
            }
        })
    }
    console.log(text);

}

function cat(path, out) {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
        handleOutput(data, out)
    })
}

async function webCat(url) {
    try {
        let res = await axios.get(url)
        handleOutput(res.data, out)
    } catch (err) {
        console.error(`Error with URL "${url}"\n${err}`)
        process.exit(1)
    }
}

let path;
let out;

if (process.argv[2] === '--out') {
    out = process.argv[3]
    path = process.argv[4]
} else {
    path = process.argv[2]
}

if (path.slice(0, 4) === 'http') {
    webCat(path, out)
} else {
    cat(path, out)
}