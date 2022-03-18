import React, { useEffect, useState } from "react";
import loadWeb3 from "./utils/getWeb3";
import Marketplace from "./contracts/Marketplace.json";
import Navbar from "./components/Navbar";
import Main from "./components/Main";

const App = () => {
  const [web3, setWeb3] = useState("");
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState("");
  const [productCount, setProductCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    const result = await loadWeb3();
    await loadBlockChainData(result);
    setWeb3(result);
  }, [web3]);

  const loadBlockChainData = async (web3) => {
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    const currentNetworkId = await web3.eth.net.getId();
    const networkData = Marketplace.networks[currentNetworkId];
    if (networkData) {
      const abi = Marketplace.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      setContract(contract);
      const productCount = await contract.methods.productCount().call();
      setProductCount(productCount);
      // console.log(typeof productCount); It is a string
      //Load products - mapping type in solidity can not iterate so use this way
      for (let i = 1; i <= Number(productCount); i++) {
        const product = await contract.methods.products(i).call();
        setProducts((prev) => [...prev, product]);
      }
      setLoading(false);
      return contract;
    } else {
      alert("the network you choose is not available");
    }
  };

  //add product
  const createProduct = (name, price) => {
    setLoading(true);
    contract.methods
      .createProduct(name, price)
      .send({ from: account })
      .once("receipt", (receipt) => {
        setLoading(false);
        setProducts((prev) => [
          ...prev,
          {
            id: products.length + 1,
            name: name,
            owner: account,
            price: price,
            purchased: false,
          },
        ]);
        console.log(receipt);
      })
      .once("error", (error) => {
        console.log(error);
        setLoading(false);
      });
  };

  //purchase product
  const purchaseProduct = (id, price) => {
    setLoading(true);
    contract.methods
      .purchaseProduct(id)
      .send({ from: account, value: price })
      .once("receipt", (receipt) => {
        setLoading(false);
        const copyProducts = [...products];
        copyProducts.forEach((product) => {
          if (product.id === id) {
            product.purchased = true;
            product.owner = account;
          }
        });
        setProducts(copyProducts);
      })
      .once("error", (error) => {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <div>
      <Navbar account={account} />
      <div className="container-fluid mt-1 ">
        <div className="row">
          <main role="main" className="col-lg-12">
            {loading ? (
              <h1 className="text-center">
                loading and processing, please be patient!
              </h1>
            ) : (
              <Main
                createProduct={createProduct}
                products={products}
                purchaseProduct={purchaseProduct}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
