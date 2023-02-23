import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-contract-sizer";
import "hardhat-tracer";
import 'solidity-coverage';

// ========== TASKS ==========

import "./tasks/01-transfer-ownership";
import "./tasks/02-set-entrance-fee";
import "./tasks/03-pause";
import "./tasks/04-unpause";
import "./tasks/05-withdraw";
import "./tasks/06-subscribe";
import "./tasks/07-unsubscribe";
import "./tasks/08-get-contract-info";

dotenv.config()

const config: HardhatUserConfig = {
    solidity: {
    version:"0.8.12",
        settings: {
            optimizer: {
            enabled: true,
            runs: 200,
            },
        },
    },
    networks: {
        hardhat: {
            accounts: { mnemonic: process.env.MNEMONIC },
            deploy: ["deploy/v1/test"],
            tags: ["test", "local"]
        },
        mumbai: {
            url: process.env.MUMBAI_URL,
            accounts: { mnemonic: process.env.MNEMONIC },
            deploy: ["deploy/v1/test"],
            tags: ["mumbai"]
        },
        polygon: {
            url: process.env.POLYGON_URL,
            accounts: { mnemonic: process.env.MNEMONIC },
            deploy: ["deploy/v1/prod"],
            tags: ["polygon"]
        },
        goerli: {
            url: process.env.GOERLI_URL,
            accounts: { mnemonic: process.env.MNEMONIC },
            deploy: ["deploy/v1/test"],
            tags: ["goerli"]
        },
        mainnet: {
            url: process.env.MAINNET_URL,
            accounts: { mnemonic: process.env.MNEMONIC },
            deploy: ["deploy/v1/prod"],
            tags: ["mainnet"]
        }
    },
    namedAccounts: {
        deployer: 0,
        daniel: 1,
        jose: 2,
        carlos: 3,
        cristian: 4,
        angela: 5
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "USD",
    },
    contractSizer: {
        alphaSort: true,
        disambiguatePaths: false,
        runOnCompile: true,
        strict: true,
        only: [],
    },
    etherscan: {
        apiKey: {
            polygon: `${process.env.POLYGON_SCAN_KEY}`,
            mainnet: `${process.env.ETHER_SCAN_KEY}`
        }
    }
};

export default config;
