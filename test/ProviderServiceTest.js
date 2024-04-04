import axios from 'axios'
import { expect } from 'chai'
import server from '../src/petService/Service.js'

describe('HTTP Service Test', () => {
    
    var baseUrl;
    before(() => {
        // Start the server before running tests
        const { address, port } = server.address();
        baseUrl = `http://localhost:${port}`;
        
    });
    
    after(() => {
        server.close();
    });

    it('should respond with "Hello World!"', async () => {

       

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

          console.log(`Service base url: ${baseUrl}`)
        const response = await axios.get(`${baseUrl}/pet/20`);
        expect(response.data).to.deep.equal(expectedResponse)
    });
});
