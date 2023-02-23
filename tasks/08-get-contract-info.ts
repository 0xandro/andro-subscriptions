import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';
import { Subscription } from '../typechain-types';


task(
    'get-contract-info',
    'get contract info',
    async (args, hre) => {
        const { ethers, getNamedAccounts } = hre

        const subscriptions: Subscription = await ethers.getContract("Subscription");

        const contractBalance = await ethers.provider.getBalance(subscriptions.address)
        const nSubscribers = await subscriptions.numOfSubscribers()
        const entranceFee = await subscriptions.entranceFee()

        console.log("Contract Balance: ", contractBalance.toString())
        console.log("Contract Entrance fee: ", entranceFee.toString())
        console.log("Contract # Subscribers: ", nSubscribers.toString())

    }
)