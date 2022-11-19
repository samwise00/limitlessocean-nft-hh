# NFT Learning Project

## Project Goals

1. Deploy a basic NFT ✅
2. Deploy NFT using IPFS utilizing Chainlink VRF ✅
3. Dynamic SVG NFT hosted 100% on chain, with the image URI changing depending on given parameters
    1. If price of ETH is above X -> happy face
    2. If price of ETH is below X -> frowny face

## Setup & Installation

`npm install --save-dev hardhat`
`npm install --save-dev @nomicfoundation/hardhat-toolbox`
`npm install --save-dev @openzeppelin/contracts`
`npm install --save-dev @chainlink/contracts --force`

Populate [hardhat.config.js](./hardhat.config.js) with network and hardhat configurations pulling keys and rpc urls from [.env](./.env)
Set up optional dev dependencies
`prettier`, `prettier-plugin-solidity`, `hardhat-deploy`

Configure [.gitignore](./.gitignore), [.prettierrc](./.prettierrc), [.prettierignore](./.prettierignore), [.solhint.json](./.solhint.json)

## Basic NFT

**References**
[EIP-721 Token Standard](https://eips.ethereum.org/EIPS/eip-721)
[ERC721 OpenZepplin Docs](https://docs.openzeppelin.com/contracts/4.x/)

Contract: 📄 [BasicNFT.sol](./contracts/BasicNFT.sol)

---

## NFT using IPFS utilizing Chainlink VRF

[Chainlink VRF Docs](https://docs.chain.link/docs/intermediates-tutorial/)

Contract: 📄 [RandomIpfsNFT.sol](./contracts/RandomIpfsNFT.sol)

## Dynamic SVG Nft

SVG to Base64 Encoding at https://base64.guru/converter/encode/image/svg

Contract: 📄 [DynamicSvgNft.sol](./contracts/DynamicSvgNft.sol)

`npm install --save-dev base64-sol` Allows us to base64 encode our svg

## Deploying

## Decentralized Image Hosting

Upload directly to IPFS or using a service like [Pinata](https://app.pinata.cloud/). We're using Pinata in this project. We can upload manually through the Pinata UI, however we will be doing it programamtically in [uploadToPinata.js](./utils/uploadToPinata.js)

Using [Pinata NodeJS SDK](https://www.npmjs.com/package/@pinata/sdk)

## Troubleshooting Log

**Issue**: Conflicting and redunant dependencies not allowing ethers to be recognized as a usable command within hardhat
**Fix**: Uninstall all separate hardhat plugins and run `npm install --save-dev @nomicfoundation/hardhat-toolbox`, then insall any additional plugins on top of that
**Notes**: This occurred because I was using independent plugs in addition to hardhat-toolbox creating conflicts and redundancies

**Reference**: [Hardhat Toolbox Docs](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-toolbox)

---

**Issue**: Linter was not working on .sol files
**Fix**: Installed additional package `solhint-pluggin-prettier`

---

**Issue**: ethers was not recognizing getContract() function from hardhat
**Fix**: `require("@nomiclabs/hardhat-ethers")` in `hardhat.config.js`, and `npm i -D @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers`

Make sure there is not a redundant `hardhat-ethers` package

---

**Issue**: `ethers.getContract()` was not detecting deployments fixture
**Fix**: I was not exporting tags during contract deployment. Fixed by adding deployment tags in deploy script: `module.exports.tags = ["all", "basicnft", "main"]`, then accessing it with `deployments.fixture([])`

---
