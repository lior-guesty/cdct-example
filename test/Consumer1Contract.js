import { expect } from 'chai';
import { defineContract } from './ContractUtil.js';

const petId = 10;

const requestPath = (baseURL,p) => `${baseURL}/api/v3/${p}`

export const Consumer1Contract = baseURL => defineContract("PetService","consumer1",requestPath(baseURL,`pet/${petId}`),(response) => {
    ///This consumer cares only about the name, the category of the pet, and the status field.
    expect(response.data.id).to.equal(petId)
    expect(response.data.name).to.be.not.empty
    expect(response.data.status).to.be.not.empty
    expect(response.data.category.id).to.be.above(-1)
    expect(response.data.category.name).to.be.not.empty
})

export const contract = Consumer1Contract