
import { expect } from 'chai';

export const Consumer2Contract = {
    consumerName : "consumer2",
    "path" : "/pet/10",
    "verification" : (response) => {
        ///This consumer cares only about the name, status and photoUrls.
        expect(response.data.id).to.equal(10)
        expect(response.data.name).to.be.not.empty
        expect(response.data.status).to.be.not.empty
        expect(response.data.photoUrls).to.be.not.empty
    }
}