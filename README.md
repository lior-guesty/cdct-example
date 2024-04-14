
# Sample Consumer-Driven Contract Testing

This repo show a simple demonstration of consumer driven contract testing.  
This is a simple proof of concept, and not by any means a fully productized framework.  

The focus here is on a demonstration of the concept rather than a fully fledge design or implementation.

Below we explain the code structure, how to run and undersand the examples, and the processes that come up from it.  
In some case we suggest design alternatives and places where more evolution is needed.

# Overview

The example shown is imagining 2 consumers of the same service.  
The service is the [petstore service](https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/petstore.json) used as the classic open API example (also in the [swagger ui](https://petstore3.swagger.io/#/pet/getPetById)).

We imagine 2 separate consumers, consumer 1 and consumer 2, each calling methods of that service. The example showns a simple method call - `/pet/:id`, which retrieves the information of a single pet in the store.

The two consumers require different things from the contract, with some overlap.  
- Consumer 1 expects the id to be the one he requested, and also requires the `name`, `category` and `status` information to be in the response.
- Consumer 2 expects the id to be the one he requested, and also requires the `name`, `status` and `photoUrls` information.

As you can see, the two consumers have some overlap in their expected contracts, but also require different things. Also, the provider of the service also returns more fields, that are not actually used by any of the consumers, e.g. the `tags`.

The sample shows only this single method, but should be easily extendible to more service methods.

# Example Walkthrough

Before diving into the code, we should point out how to look at this example.  
The different scenarios are set in different git branches.

We assume you have the project cloned locally with node.js available and you ran `npm install`.

## Happy Path
To start, switch to `contract_def` branch and run the tests:
```bash
> git checkout contract_def
> npm test
```

You should see 4 tests passing - Consumer 1 test, Consumer 2 test, and 2 provider tests ("simple pet get" and verifying all consumers contract).

This simulates a complete run of all the tests, but not that in a real setup, these tests would probably run separately:
- The consumers' tests would run in the consumers' repos.
- The producer's full test ("simple pet get") would run in the producer repo
- The contracts verification would run from the shared contract repo.

## Provider Breaks All Contracts
Now, let's assume the provider makes a change and inadvertenly breaks all the contracts.  
The change in this case is simple - removing the "name" field.  
The provider makes the change in the service, and also updates his tests, so everything is ok from his point of view.

Switch to the `service_breaks_all_contracts` branch, and re-run the tests:
```bash
> git checkout service_breaks_all_contracts
> npm test
```

You should see 1 test failing - the provider's test checking for the contracts.  
Note that the provider's simple test didn't break since the provider updated his own test (in his repo) with the change made - removing the 'name' field.

But the contracts, which are in another repo, broke. So when running the contract tests, _by the provider_, the test fails.

## Provicer Breaks One Contract

Now, let's assume a different change - the service does not return the `category.name` field.  

Switch to `service_breaks_one_contract` branch, and run the tests again (`npm test`).  
You should be able to see that one test broke - the provider running all the contracts.

But if you look carefully at the output, you'll see that only one consumer broke (consumer 1):
```
Results: [{"consumer":"consumer1","success":false},{"consumer":"consumer2","success":true}]
```

The failure happens only for the contract of consumer 1.  
In this case, the contract for consumer 2 wasn't broken.  
Note that also in this case, the provider has made the changes in his own tests so the change seems ok from his point of view.

The provider can now approach the team for the 1st consumer and discuss the changes with them, before making any deployments.
After making necessary changes (either in the provider or the consumer, or both), the teams can proceed with deployments.
The important thing is that breaking change was identified early and with the consumer that actually cares about it.



# Code Structure

The sample code is very simple, intentionally so we can focus on the concepts and not so much on th mechanics of execution.  
So the exact choice of libraries or directory structure is not critical.

What _is_ important is that it executes as simple unit tests which can be easily executed by the provider and consumers, locally as well as in CI.  
The tests focus on the contract between the components (consumers and provider), not on setting up implementation details. Mocks are used where necessary.

For example simplicity we put all the code in the same repo (this repo), but in a real setting we expect the code to be in separate repos, as is shown in this picture:

![CDCT Components](./docs/TechRoadmap-CDCT%20Components.drawio.png)

## The Provider Code

The provided service is implemented in [`/src/petService/Service.js`](./src/petService/Service.js).  
The service is exposed on port 3001 and exposes a single method: `GET '/api/v3/pet/:id'`.  
Internally, the method implementation queries an in-memory `DB` object with the available pets. This is of course where a real implementation would go to an actual database and query for results.

Also, a more robust implementation would handle validation of inputs, error conditions etc.

The provider's own tests are in [`/test/ProviderServiceTest.js'](./test/ProviderServiceTest.js).  
This is a simple unit test, with a simple test to get a pet by ID. Of course, a more complete test should include error conditions, different types of input/output combinations, etc.

Another test in the `ProviderServiceTest.js` file is a simple test that runs through all the consumer contract it identifies.

The provider code should be in the service producer repo.

Note that when the producer is running the tests, it is running against an actual service instance running, not against a mock created for the test.

## Consumers Code

We show here only the consumers' test code, and their contract definition. The contract is defined in [`/test/Consumer1Contract.js`](./test/Consumer1Contract.js) and [`/test/Consumer2Contract.js`](./test/Consumer2Contract.js) (one per consumer).

This is code that should reside in the "Producer-Consumer Contract Repo" (from the diagram above). It is owned by the consumer teams, but accessible for execution also to the producer team.

You'll note that contract is defined using [`ContractUtil.js`](./test/ContractUtil.js), which implements a simple mini-framework for defining and accessing contracts.

Each consumer also has a method for running their own contract (e.g. in `/test/Consumer1Contract`). This is to show that consumer may want to make sure their code also adheres to the contract. In this example, it simply runs the contract against a mock of the service. The mock actually implements the contract.  
In a more complete process, the mock would be generated from the producer's definition, e.g. some OpenAPI spec, and fed with some mock data. This isn't shown here (for now).  
What's important is that the consumer can verify his code with the contract he defined.

## Contract Util

The [`ContractUtil`](./test/ContractUtil.js) file shows a way to simply define and query available contracts. It's meant as a placeholder (and demonstration) of a more complete framework for CDCTs; [pact.io](http://pact.io) is an example of a more robust tool in that direction.

This module currently defines the following functions:
- `defineContract`: given a producer name, a consumer name, path to the contract and verification function, this creates a new "Contract Object".
    - You can see this used in the consumer contract definitions
    - Design alternatives: this could be a simple JSON definition or some utility script that inserts the contract information to a database of contracts.
- `runContract`: allows one to run a specific contract, given a contract object (defined in `defineContract`)
    - You can see this used in the consumer tests.
- `loadContractsFrom`: loads the set of contract from a certain file system location. For the purposes of this example, this goes through the test files and looks for files ending with "Contract", specifically looking for an exposed `contract` variable.
    - Design alternative: a set of JSON files, DB records, some registration mechanism.
    - You can see this used in the `ProviderServiceTest`, when running all the contracts for the provider.
- `runContract`: given a set of contract objects, loaded using `loadContractsFrom`, run all of them, and report errors where necessary.
    - You can see this used in the `ProviderServiceTest`, when running all the contracts for the provider.

