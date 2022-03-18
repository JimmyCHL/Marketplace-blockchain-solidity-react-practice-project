require("chai").use(require("chai-as-promised")).should();
//you can put './Marketplace.sol' or 'Marketplace.sol', either way is fine
const Marketplace = artifacts.require("./Marketplace.sol");

//The contract() function provides a list of accounts made available by your Ethereum client which you can use to write tests.
contract("Marketplace", ([deployer, seller, buyer]) => {
    let marketplace;
    console.log(deployer, seller, buyer);

    before(async() => {
        marketplace = await Marketplace.deployed();
    });

    describe("deployment", async() => {
        it("deploys successfully", async() => {
            const address = await marketplace.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, "");
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });

        it("has a name", async() => {
            const name = await marketplace.name();
            assert.equal(name, "Jimmy MarketPlace");
        });
    });

    describe("products", async() => {
        let result, productCount;

        before(async() => {
            //smart contract always deal with wei value
            result = await marketplace.createProduct(
                "iPhone X",
                web3.utils.toWei("1", "ether"), { from: seller } //metaData -> msg.sender come from here
            );
            productCount = await marketplace.productCount();
            // console.log(productCount.toNumber());
            // console.log(result);
        });

        it("creates products", async() => {
            //SUCCESS
            // console.log(productCount);
            assert.equal(productCount.toNumber(), 1);
            // console.log(result.logs);
            const event = result.logs[0].args;
            assert.equal(
                event.id.toNumber(),
                productCount.toNumber(),
                "id isn't correct"
            );
            assert.equal(event.name, "iPhone X", "product is not correct");
            assert.equal(event.price, "1000000000000000000", "price is not correct");
            assert.equal(event.owner, seller, "owner is not correct");
            assert.equal(event.purchased, false, "purchase is not correct");

            //FAILURE: Product must have a name
            await marketplace.createProduct("", web3.utils.toWei("1", "ether"), {
                from: seller,
            }).should.be.rejected;
            //FAILURE: Product must have a price
            await marketplace.createProduct("iPhone X", 0, {
                from: seller,
            }).should.be.rejected;
        });

        it("lists products", async() => {
            const product = await marketplace.products(productCount);
            assert.equal(
                product.id.toNumber(),
                productCount.toNumber(),
                "id isn't correct"
            );
            assert.equal(product.name, "iPhone X", "product is not correct");
            assert.equal(
                product.price,
                "1000000000000000000",
                "price is not correct"
            );
            assert.equal(product.owner, seller, "owner is not correct");
            assert.equal(product.purchased, false, "purchase is not correct");
        });

        it("sells products", async() => {
            //Track the seller balance before purchase
            let oldSellerBalance;
            oldSellerBalance = await web3.eth.getBalance(seller);
            // console.log(oldSellerBalance);
            oldSellerBalance = await web3.utils.toBN(oldSellerBalance);
            // console.log(oldSellerBalance);

            //SUCCESS: Buyer makes purchase
            const result = await marketplace.purchaseProduct(productCount, {
                from: buyer,
                value: web3.utils.toWei("1", "ether"),
            });
            // console.log(result);

            //Check logs
            const event = result.logs[0].args;
            assert.equal(
                event.id.toNumber(),
                productCount.toNumber(),
                "id isn't correct"
            );
            assert.equal(event.name, "iPhone X", "product is not correct");
            assert.equal(event.price, "1000000000000000000", "price is not correct");
            assert.equal(event.owner, buyer, "owner is not correct");
            assert.equal(event.purchased, true, "purchase is not correct");

            // CHECK that seller received funds
            let newSellerBalance;
            newSellerBalance = await web3.eth.getBalance(seller);
            newSellerBalance = await web3.utils.toBN(newSellerBalance);

            let price;
            price = web3.utils.toWei("1", "ether");
            price = new web3.utils.toBN(price);

            const expectedBalance = oldSellerBalance.add(price);

            assert.equal(
                newSellerBalance.toString(),
                expectedBalance.toString(),
                "Balance did not match"
            );

            //FAILURE: Tries to buy a product that does not exist, i.e, product must have valid id
            await marketplace.purchaseProduct(99, {
                from: buyer,
                value: web3.utils.toWei("1", "ether"),
            }).should.be.rejected;

            //FAILURE:Buyer tries to buy without enough ether
            await marketplace.purchaseProduct(productCount, {
                from: buyer,
                value: web3.utils.toWei("0.5", "ether"),
            }).should.be.rejected;

            //FAILURE: Contract Deployer can't buy the product
            await marketplace.purchaseProduct(productCount, {
                from: deployer,
                value: web3.utils.toWei("1", "ether"),
            }).should.be.rejected;

            //FAILURE: buyer can't be the seller
            await marketplace.purchaseProduct(productCount, {
                from: seller,
                value: web3.utils.toWei("1", "ether"),
            }).should.be.rejected;
        });
    });
});