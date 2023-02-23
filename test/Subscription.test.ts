import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, deployments, getNamedAccounts } from 'hardhat'
import { Subscription } from "../typechain-types";
import { BigNumber } from "ethers";
import { expect } from 'chai'


describe('Subscription.sol', () => {

    let deployer: SignerWithAddress;
    let daniel: SignerWithAddress;
    let subscription: Subscription;
    let fee: BigNumber;


    before(async () => {

        const { daniel:danielAddress, deployer:deployerAddress, jose:joseAddress } = await getNamedAccounts();

        daniel = await ethers.getSigner(danielAddress);
        deployer = await ethers.getSigner(deployerAddress);

    })

    beforeEach(async () => {

        await deployments.fixture(); // Always start from a fresh environment.

        subscription = await ethers.getContract("Subscription");
        fee = await subscription.entranceFee();

    })

    // ===================================
    // ============ SUBSCRIBE ============
    // ===================================

    describe("#subscribe", async () => {

        describe("When contract is paused", async () => {

            beforeEach(async () => {
                await subscription.connect(deployer).pause();
            })

            it("should revert", async () => {
                await expect(subscription.connect(daniel).subscribe({ value:fee })).to.be.revertedWith("Pausable: paused");
            })

        })

        describe("When contract is not paused", async () => {

            beforeEach(async () => {
                await deployments.fixture();
            })

            describe("When already subscribed", async () => {
    
                beforeEach(async () => {
                    await subscription.connect(daniel).subscribe({value: fee});
                })
    
                it("should revert", async () => {
                    await expect(subscription.connect(daniel).subscribe({value: fee})).to.be.revertedWith("SUBSCRIPTION: ALREADY_SUBSCRIBED");
                })
    
            })
    
            describe("When not subscribed", async () => {
    
                describe("When user doesn't send enough value to pay entrance fee", async () => {

                    it("should revert", async () => {
                        await expect(subscription.connect(daniel).subscribe()).to.be.revertedWith("SUBSCRIPTION: NOT_ENOUGH_BALANCE_FEE");
                    })
                })
    
                describe("When user sends enough value to pay entrance fee", async () => {
    
                    beforeEach(async () => {
                        await deployments.fixture();
                    })
    
                    it('Should store user as subscriber', async () => {
    
                        await subscription.connect(daniel).subscribe({value: fee});
                        let userIsSubscribed = await subscription.subscriber(daniel.address);
                        expect(userIsSubscribed).to.be.true; 
                    })
                
                    it('Should increment subscribers count by one', async () => {
                
                        let numOfSubscribers = await subscription.numOfSubscribers();
                
                        await subscription.connect(daniel).subscribe({value: fee});
                
                        let newNumOfSubscribers = await subscription.numOfSubscribers();
                
                        expect(newNumOfSubscribers).to.be.greaterThan(numOfSubscribers);
                        expect(newNumOfSubscribers).to.be.equals(numOfSubscribers.add(1));
                    })
                    
                    it('Should emit `Subscribed` event with msg.sender, msg.value and entranceFee parameters', async () => {
        
                        let value = fee
        
                        await expect(subscription.connect(daniel).subscribe({value: value}))
                            .to.emit(subscription, "Subscribed")
                            .withArgs(
                                daniel.address,
                                fee,
                                value
                            );
                    })
                })
            })
        })
    })


    // ===================================
    // =========== UNSUBSCRIBE ===========
    // ===================================

    describe("#unsubscribe", async () => {

        describe("When user isn't subscribed yet", async () => {

            it("should revert", async () => {
                await expect(subscription.connect(daniel).unsubscribe()).to.be.revertedWith("SUBSCRIPTION: NOT_SUBSCRIBED");
            })

        })

        describe("When user is already subscribed", async () => {

            beforeEach(async () => {
    
                await deployments.fixture();
                await subscription.connect(daniel).subscribe({ value:fee });
    
            })
    
            it('Should delete users from subscribers mapping', async () => {
            
                await subscription.connect(daniel).unsubscribe();
                expect(await subscription.subscriber(daniel.address)).to.be.false;
            
            })
    
            it('Should decrease subscribers count by one', async () => {
    
                let numOfSubscribers = await subscription.numOfSubscribers();
                await subscription.connect(daniel).unsubscribe();
                let newNumOfSubscribers = await subscription.numOfSubscribers();
                
                expect(newNumOfSubscribers).to.be.lessThan(numOfSubscribers);
                expect(newNumOfSubscribers).to.be.equal(numOfSubscribers.sub(1));
                
            })
    
            it('Should emit an `Unsubscribed` event with msg.sender as argument', async () => {
                
                await expect(subscription.connect(daniel).unsubscribe()).to.emit(subscription, "Unsubscribed")
                    .withArgs(
                        daniel.address
                    );
            })
        })
    })

    // ===================================
    // =========== OWNER FUNCS ===========
    // ===================================

    describe("#owner-funcs", async () => {

        beforeEach(async () => {
            await deployments.fixture()
        })

        describe("when caller is not owner", async () => {

            it('should revert (withdraw)', async () => {
                await expect(subscription.connect(daniel).withdraw(daniel.address)).to.be.revertedWith("Ownable: caller is not the owner")
            })
            it('should revert (setEntranceFee)', async () => {
                await expect(subscription.connect(daniel).setEntranceFee(fee)).to.be.revertedWith("Ownable: caller is not the owner")
            })
            it('should revert (pause)', async () => {
                await expect(subscription.connect(daniel).pause()).to.be.revertedWith("Ownable: caller is not the owner")
            })
            it('should revert (unpause)', async () => {
                await expect(subscription.connect(daniel).unpause()).to.be.revertedWith("Ownable: caller is not the owner")
            })
            
        })

        describe("when caller is the owner", async () => {

            it("Should be able to set entrance fee", async () => {

                const feeToSet = "2"
                await subscription.connect(deployer).setEntranceFee(feeToSet)
                const newFee = await subscription.entranceFee()

                expect(newFee).to.be.equals(feeToSet)
                
            })

            it("should be able to withdraw funds from the contract", async () => {
                expect(await subscription.connect(deployer).withdraw(deployer.address)).to.not.be.reverted
            })

            it("should be able to pause the contract", async () => {
                await subscription.connect(deployer).pause()
                expect(await subscription.paused()).to.be.true
            })

            describe("When paused", async () => {

                beforeEach(async () => {
                    await deployments.fixture()
                    await subscription.connect(deployer).pause()
                })

                it("should be able to unpause the contract", async () => {
                    await subscription.connect(deployer).unpause()
                    expect(await subscription.paused()).to.be.false
                })

            })
        })
    })

    // ===================================
    // ============ WITHDRAW =============
    // ===================================

    describe("#withdraw", async () => {

        beforeEach(async () => {
            await deployments.fixture()
        })

        describe("when `_to` is address(0)", async () => {

            it("should revert", async () => {
                await expect(subscription.connect(deployer).withdraw(ethers.constants.AddressZero)).to.be.revertedWith("SUBSCRIPTION: ADDRESS 0")
            })

        })
    })
})