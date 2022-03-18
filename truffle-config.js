const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    contracts_build_directory: path.join(__dirname, "client/src/contracts"),
    networks: {
        develop: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*", // Match any network id
        },
        rinkeby: {
            provider: () =>
                new HDWalletProvider(
                    process.env.SEED_PHRASE,
                    process.env.INFURA_LINK,
                    1 //ACCOUNT INDEX
                ),
            network_id: 4,
            gas: 5500000,
            confirmations: 2,
            timeoutBlocks: 200,
            skipDryRun: true,
        },
    },
    compilers: {
        solc: {
            version: "0.8.11",
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
};