const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Random IPFS NFT Unit Tests", function () {
          let randomIpfsNft, deployer, vrfCoordinatorV2Mock
          beforeEach(async () => {
              // get fixtures with deployer account for vrfCoordinatorV2Mock and ipfsNft
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["mocks", "randomipfs"])
              randomIpfsNft = await ethers.getContract("IpfsNft")
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
          })
          describe("requestNft", () => {
              it("fails if payment isn't sent with the request", async function () {
                  await expect(randomIpfsNft.requestNft()).to.be.revertedWithCustomError(
                      randomIpfsNft,
                      "IpfsNft__NotEnoughEthToMint"
                  )
              })
              it("reverts if payment amount is less than the mint fee", async function () {
                  await expect(
                      randomIpfsNft.requestNft({
                          value: 1,
                      })
                  ).to.be.revertedWithCustomError(randomIpfsNft, "IpfsNft__NotEnoughEthToMint")
              })
              it("emits an event and kicks off a random word request", async function () {
                  const mintFee = await randomIpfsNft.getMintFee()
                  const requestNftResponse = await randomIpfsNft.requestNft({
                      value: mintFee,
                  })
                  const requestNftReceipt = await requestNftResponse.wait(1)
                  assert.equal(requestNftReceipt.events[1].event, "NftRequested")
              })
          })
          describe("fulfillRandomWords", () => {
              it("mints NFT after random number is returned", async () => {
                  // create a promise that listens for minted event using .once, then makes assertions on the new NFT
                  await new Promise(async (resolve, reject) => {
                      randomIpfsNft.once("NftMinted", async () => {
                          // this code will run once the NFT has been successfully minted and the NftMinted event has been fired
                          try {
                              // asser there is an ipfs url
                              // assert token count has increased
                              const tokenUri = await randomIpfsNft.tokenURI("0")
                              const tokenCounter = await randomIpfsNft.getTokenCounter()
                              assert.equal(tokenUri.toString().includes("ipfs://"), true)
                              assert.equal(tokenCounter.toString(), "1")
                              resolve()
                          } catch (e) {
                              console.log(e)
                              reject(e)
                          }
                      })

                      // Mint the NFT
                      try {
                          const mintFee = await randomIpfsNft.getMintFee()
                          const requestNftResponse = await randomIpfsNft.requestNft({
                              value: mintFee,
                          })
                          const requestNftReceipt = await requestNftResponse.wait(1)
                          await vrfCoordinatorV2Mock.fulfillRandomWords(
                              requestNftReceipt.events[1].args.requestId,
                              randomIpfsNft.address
                          )
                      } catch (e) {
                          console.log(e)
                          reject(e)
                      }
                  })
              })
          })
          describe("ModdedRng", () => {
              it("expect input of 0 to return index of 0 (legendary)", async () => {
                  const rarity = await randomIpfsNft.getRarityFromModdedRange(0)
                  assert.equal(rarity, 0)
              })
              it("expect input of 1 to return index of 1 (rare)", async () => {
                  const rarity = await randomIpfsNft.getRarityFromModdedRange(1)
                  assert.equal(rarity, 1)
              })
              it("expect input of 11 to return index of 2 (uncommon)", async () => {
                  const rarity = await randomIpfsNft.getRarityFromModdedRange(11)
                  assert.equal(rarity, 2)
              })
              it("expect input of 31 to return index of 3 (common)", async () => {
                  const rarity = await randomIpfsNft.getRarityFromModdedRange(31)
                  assert.equal(rarity, 3)
              })
          })
      })
