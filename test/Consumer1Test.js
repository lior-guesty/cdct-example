import axios from 'axios';
import { expect } from 'chai';
import nock from 'nock';

const BASE_URL = "http://localhost:3000"
const requestPath = (p) => `${BASE_URL}/api/v3/${p}`

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

describe('PetStore Service', () => {
    before(() => {
        // Mocking the HTTP server response
        nock(BASE_URL)
            .get(/\/pet\/(\d+)/)
            .reply(function (uri, requestBody) {
                const petID = uri.match(/\/pet\/(\d+)/)[1]; // Extracting pet ID from URL
                return [200, mockData[petID]];
            });
        
        
    });

    it('should respond with a dog, category and a status field', async () => 
    {
        const petID = 10
        const response = await axios.get(requestPath(`pet/${petID}`));

        ///This consumer cares only about the name, the category of the pet, and the status field.
        expect(response.data.id).to.equal(petID)
        expect(response.data.name).to.be.not.empty
        expect(response.data.status).to.be.not.empty
        expect(response.data.category.id).to.be.above(-1)
        expect(response.data.category.name).to.be.not.empty

    });
});
