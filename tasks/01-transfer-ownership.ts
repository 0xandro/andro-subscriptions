import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';
import { Subscription } from '../typechain-types';


task(
    'transfer-ownership',
    'transfers ownership',
    async (args: { to: string }, hre) => {
        const { ethers } = hre

        const subscriptions: Subscription = await ethers.getContract("Subscription")

        let tx = await subscriptions.transferOwnership(args.to)
        let rc = await tx.wait(1)
        const event = rc.events?.filter(e => e.event == "OwnershipTransferred")[0];

        console.log("OwnershipTransferred \n")
        console.log(`
            previousOwner: ${event?.args?.previousOwner}\n
            newOwner: ${event?.args?.newOwner}
        `)

    }
)
.addParam("to")