import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';
import { Subscription } from '../typechain-types';


task(
    'subscribe',
    'subscribe',
    async (args: { value:string, signer:string }, hre) => {

        const { ethers } = hre;
        const signer = await ethers.getNamedSigner(args.signer)

        const subscriptions: Subscription = await ethers.getContract("Subscription")

        let tx = await subscriptions.connect(signer).subscribe({"value": args.value })
        let rc = await tx.wait(1)
        const event = rc.events?.filter(e => e.event == "Subscribed")[0];

        console.log("Subscribed \n")
        console.log(`
            subscriber: ${event?.args?.subscriber}\n
            baseFee: ${event?.args?.baseFee}\n
            paidFee: ${event?.args?.paidFee}\n
            signer: ${args.signer}
        `)

    }
)
.addParam("value")
.addParam("signer")