
import axios from 'axios';
import fs from 'node:fs'

export async function runContract(contractObj)
{
    const response = await axios.get(contractObj.path)
    contractObj.verification(response);
}

export function defineContract(forService,consumerName, path, verifier)
{ //TODO: validate inputs
    return {
        "service" : forService,
        consumerName : consumerName,
        "path" : path,
        "verification" : verifier
    }
}

export function loadContractsFrom(fsPath)
{
    let files = fs.readdirSync(fsPath)
    let importPromises = files.filter(filename => filename.match(/Contract.js/))
         .map(filename => `./${filename}`)
         .map(contractPath => import(contractPath))
    return Promise.all(importPromises)

}