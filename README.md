# ANDRO SUBSCRIPTIONS

## Dependencies

Install `Node.js`.

Run `npm install` to install all the dependencies.

## Local deployment

A local blockchain is required for local deployments.
In a separate terminal run `npx hardhat node`.
Run `npx hardhat deploy --network localhost` to compile and deploy the contracts.

## Testing
Run `npm run test` to run all tests inside `/test` folder (make sure to install dependencies first).

## Coverage
Run `npm run coverage` to check full testing coverage (make sure to install dependencies first).

## Naming Conventions:
* Function parameters start with underscore "_".
* Function names should be camelCase.
* Contract names should be Capitalized.
* Event names should be uppercase.
