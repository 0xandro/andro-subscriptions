import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';
import { Subscription } from '../typechain-types';


task(
    'set-entrance-fee',
    'set entrance fee',
    async (args: { fee: string }, hre) => {
        const { ethers } = hre

        const subscriptions: Subscription = await ethers.getContract("Subscription")

        let tx = await subscriptions.setEntranceFee(args.fee)
        let rc = await tx.wait(1)
        const event = rc.events?.filter(e => e.event == "EntranceFeeSet")[0];

        console.log("EntranceFeeSet \n")
        console.log(`
            fee: ${event?.args?.fee}\n
            owner: ${event?.args?.owner}
        `)

    }
)
.addParam("fee")