import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';
import { Subscription } from '../typechain-types';


task(
    'pause',
    'pause contract',
    async (args, hre) => {

        const { ethers } = hre;
        const subscriptions: Subscription = await ethers.getContract("Subscription");

        let tx = await subscriptions.pause();
        let rc = await tx.wait(1);
        const event = rc.events?.filter(e => e.event == "Paused")[0];

        console.log("Paused \n");
        console.log(`
            account: ${event?.args?.account}
        `);

    }
)