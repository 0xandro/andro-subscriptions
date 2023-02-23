import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from 'hardhat';

const contractName = "Subscription";
const contractVersion = "1.0.0";

const ENTRANCE_FEE_TEST = ethers.utils.parseUnits(
    process.env.ENTRANCE_FEE_TEST as string,
    "wei"
)

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;

    let { deployer } = await getNamedAccounts();

    await deploy(contractName, {
        from: deployer,
        log: true,
        args: [
           ENTRANCE_FEE_TEST
        ]
    });

};

export default func;
func.id = contractName + contractVersion;
func.tags = [contractName, contractVersion];
