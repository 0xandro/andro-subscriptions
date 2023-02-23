import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';
import { Subscription } from '../typechain-types';


task(
    'unsubscribe',
    'unsubscribe',
    async (args: { signer:string }, hre) => {

        const { ethers } = hre;
        const signer = await ethers.getNamedSigner(args.signer)

        const subscriptions: Subscription = await ethers.getContract("Subscription")

        let tx = await subscriptions.connect(signer).unsubscribe()
        let rc = await tx.wait(1)
        const event = rc.events?.filter(e => e.event == "Unsubscribed")[0];

        console.log("Unsubscribed \n")
        console.log(`
            subscriber: ${event?.args?.subscriber}\n
            signer: ${args.signer}
        `)

    }
)
.addParam("signer")