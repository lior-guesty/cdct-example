import axios from 'axios'
import { expect } from 'chai'
import server from '../src/petService/Service.js'

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

        const response = await axios.get(`${baseUrl}/pet/20`);
        expect(response.data).to.deep.equal(expectedResponse)
    });

});
