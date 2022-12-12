const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const mint = async () => {
    console.log(network.config.chainId)
    const ipfsNft = await ethers.getContract("IpfsNft")

    const mintFee = await ipfsNft.getMintFee()
    const requestNftTx = await ipfsNft.requestNft({
        value: mintFee,
    })
    console.log(`Minting... TX: ${requestNftTx.hash}`)
    const requestNftTxReceipt = await requestNftTx.wait(1)

    if (network.config.chainId == "31337") {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        const fulfillRandomWordsTx = await vrfCoordinatorV2Mock.fulfillRandomWords(
            requestNftTxReceipt.events[1].args.requestId,
            ipfsNft.address
        )

        const fulfillRandomWordsReceipt = await fulfillRandomWordsTx.wait(1)
        console.log(fulfillRandomWordsReceipt)
        await moveBlocks(2, (sleepAmount = 5000))
    }
}

mint()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
