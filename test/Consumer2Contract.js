
import { expect } from 'chai';
import { defineContract } from './ContractUtil.js';

const requestPath = (baseURL,p) => `${baseURL}/api/v3/${p}`
const petId = 10;

export const Consumer2Contract = baseURL => defineContract("PetService","consumer2",requestPath(baseURL,`pet/${petId}`),(response) => {
    ///This consumer cares only about the name, status and photoUrls.
    expect(response.data.id).to.equal(petId)
    expect(response.data.name).to.be.not.empty
    expect(response.data.status).to.be.not.empty
    expect(response.data.photoUrls).to.be.not.empty
})
export const contract = Consumer2Contract