import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';
import { Subscription } from '../typechain-types';


task(
    'unpause',
    'unpause contract',
    async (args, hre) => {

        const { ethers } = hre;
        const subscriptions: Subscription = await ethers.getContract("Subscription")

        let tx = await subscriptions.unpause()
        let rc = await tx.wait(1)
        const event = rc.events?.filter(e => e.event == "Unpaused")[0];

        console.log("Unpaused \n")
        console.log(`
            account: ${event?.args?.account}
        `)

    }
)