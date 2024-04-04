import axios from 'axios';
import nock from 'nock';
import { Consumer1Contract } from './Consumer1Contract.js';
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
          "string"
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

describe('PetStore Service - Consumer 1', () => {
    before(() => {
        // Mocking the HTTP server response
        nock(BASE_URL)
            .get(/\/pet\/(\d+)/)
            .reply(function (uri, _) {
                const petID = uri.match(/\/pet\/(\d+)/)[1]; // Extracting pet ID from URL
                return [200, mockData[petID]];
            });
        
        
    });

    it('Contract expects a dog, category and a status field', async () => 
    {
      runContract(Consumer1Contract(BASE_URL))
    });
});
