
import axios from 'axios';

export async function runContract(contractObj)
{
    console.log(`running contract for ${contractObj}`)
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