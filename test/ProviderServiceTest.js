import axios from 'axios'
import { expect } from 'chai'
import server from '../src/petService/Service.js'
import { loadContractsFrom, runContract } from './ContractUtil.js';

describe('Pet Store Service - Provider Test', () => {
    
    var baseUrl;
    before(() => {
        // Start the server before running tests
        const { port } = server.address();
        baseUrl = `http://localhost:${port}`;
        
    });

    after(() => {
        server.close();
    });

    it('simple pet get', async () => {

        const expectedResponse = {
            "id": 20,
            "name": "mitzy",
            "category": {
              "id": 2,
              "name": "Cats"
            },
            "photoUrls": [
              `/assets/20.jpg`
            ],
            "tags": [
              {
                "id": 0,
                "name": "thunder"
              }
            ],
            "status": "available"
          }

        const response = await axios.get(`${baseUrl}/api/v3/pet/20`);
        expect(response.data).to.deep.equal(expectedResponse)
    });

    it ("should verify all consumer contracts", async () => {

        let contracts = (await loadContractsFrom('./test'))
                        .map(m => m.contract(baseUrl))
        
        let results = await Promise.all(contracts.map(async c => { 
                                                        //console.log(`Making a request to ${c.path}`)
                                                        let response = await axios.get(c.path)
                                                        c.verification(response)
                                                        return  { consumer : c.consumerName, success : true}
                                                    }))
        
        console.log(`Results: ${JSON.stringify(results)}`)

        
    })


});
