import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from 'hardhat';
import { BigNumber } from 'ethers';
import * as dotenv from "dotenv";

dotenv.config();

const contractName = "Subscription";
const contractVersion = "1.0.0";

const ENTRANCE_FEE_MATIC = ethers.utils.parseUnits(
    process.env.ENTRANCE_FEE_MATIC as string,
    "wei"
);

const ENTRANCE_FEE_ETHER = ethers.utils.parseUnits(
    process.env.ENTRANCE_FEE_ETHER as string,
    "wei"
);

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

    const { deployments, getNamedAccounts, network } = hre;
    const { deploy, execute } = deployments;
    let { deployer } = await getNamedAccounts();

    let entranceFee: BigNumber

    if (network.name == "mainnet") {
        entranceFee = ENTRANCE_FEE_ETHER 
    }

    else if (network.name == "polygon") {
        entranceFee = ENTRANCE_FEE_MATIC
    }

    else {
        throw new Error(`SUBSCRIPTION FEE FOR NETWORK: ${network.name} NOT SET`)
    }


    await deploy(contractName, {
        from: deployer,
        log: true,
        args: [
            entranceFee
        ]
    });

    await execute(contractName, 
        {
            from: deployer,
            log:true,
        },
        "transferOwnership",
        process.env.NEW_OWNER_ADDRESS
    )

};

export default func;
func.id = contractName + contractVersion;
func.tags = [contractName, contractVersion];
