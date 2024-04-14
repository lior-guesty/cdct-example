
import axios from 'axios';
import fs from 'node:fs'

function verificationAsBoolean(verifierFunc)
{
    try {
        verifierFunc();
        return true;
    }
    catch (err)
    {
        console.error(err.toString())
        return false;
    }
}

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

export async function runContractsAsProvider(contracts)
{
    let results = await Promise.all(contracts.map(async c => { 
        let response = await axios.get(c.path)
        let result = verificationAsBoolean(() => { c.verification(response) })
        return  { consumer : c.consumerName, success : result}
    }))
    return results;
}