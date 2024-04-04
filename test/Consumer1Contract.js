
import { expect } from 'chai';

export const Consumer1Contract = {
    consumerName : "consumer1",
    "path" : "/pet/10",
    "verification" : (response) => {
        ///This consumer cares only about the name, the category of the pet, and the status field.
        expect(response.data.id).to.equal(10)
        expect(response.data.name).to.be.not.empty
        expect(response.data.status).to.be.not.empty
        expect(response.data.category.id).to.be.above(-1)
        expect(response.data.category.name).to.be.not.empty
    }
}