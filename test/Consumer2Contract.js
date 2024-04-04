
import { expect } from 'chai';
import { defineContract } from './ContractUtil.js';

const requestPath = (baseURL,p) => `${baseURL}/api/v3/${p}`

export const Consumer2Contract = baseURL => defineContract("PetService","consumer2",requestPath(baseURL,"/pet/10"),(response) => {
    ///This consumer cares only about the name, status and photoUrls.
    expect(response.data.id).to.equal(10)
    expect(response.data.name).to.be.not.empty
    expect(response.data.status).to.be.not.empty
    expect(response.data.photoUrls).to.be.not.empty
})
