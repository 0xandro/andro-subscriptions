import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';
import { Subscription } from '../typechain-types';


task(
    'withdraw',
    'withdraw profits',
    async (args: { to: string }, hre) => {

        const { ethers } = hre;
        const subscriptions: Subscription = await ethers.getContract("Subscription")

        let tx = await subscriptions.withdraw(args.to)
        let rc = await tx.wait(1)
        const event = rc.events?.filter(e => e.event == "Withdraw")[0];

        console.log("Withdraw \n")
        console.log(`
            balance: ${event?.args?.balance}\n
            to: ${event?.args?.to}\n
            owner: ${event?.args?.owner}
        `)

    }
)
.addParam("to")