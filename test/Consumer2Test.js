import axios from 'axios';
import nock from 'nock';
import { Consumer2Contract } from './Consumer2Contract.js';
import { runContract } from './ContractUtil.js';

const BASE_URL = "http://localhost:3000"

const mockData = {
    10 : {
        "id": 10,
        "name": "doggie",
        "category": {
          "id": 1,
          "name": "Dogs"
        },
        "photoUrls": [
          `${BASE_URL}/assets/10.jpg`
        ],
        "tags": [
          {
            "id": 0,
            "name": "string"
          }
        ],
        "status": "available"
      }
}

describe('PetStore Service - Consumer 2', () => {
    before(() => {
        // Mocking the HTTP server response
        nock(BASE_URL)
            .get(/\/pet\/(\d+)/)
            .reply(function (uri, requestBody) {
                const petID = uri.match(/\/pet\/(\d+)/)[1]; // Extracting pet ID from URL
                return [200, mockData[petID]];
            });
        
        
    });

    it('Contract expects a name, status and photo urls', async () => 
    {
        runContract(Consumer2Contract(BASE_URL))
    });
});
