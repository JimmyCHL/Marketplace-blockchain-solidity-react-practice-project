pragma solidity ^0.8.11;

contract Marketplace {
   string public name;
   uint public productCount = 0;
   struct Product {
       uint id;
       string name;
       uint price;
       address owner;
       bool purchased;
   }
   mapping(uint => Product) public products;

   event ProductCreated(  
       uint id,
       string name,
       uint price,
       address owner,
       bool purchased);

    event ProductPurchased( 
       uint id,
       string name,
       uint price,
       address owner,
       bool purchased);

   constructor(){
       name = "Jimmy MarketPlace";
   }

   //Make sure parameters are correct
   function createProduct(string memory _name, uint _price) public {
       //Require a valid name
        require(bytes(_name).length > 0, 'you need to enter the name!');
       //Require a valid price
       require(_price > 0, 'Your price must go beyound than 0 eth');
       //Increment productCount
       productCount++;
       //Create the product
       products[productCount] = Product(productCount, _name, _price, msg.sender, false);
       // Trigger an event
       emit ProductCreated(productCount, _name, _price,  msg.sender, false);
   }

   function purchaseProduct(uint _id) payable public {
       //Make sure the product id is valid
       require(_id > 0 && _id <= productCount, 'Id number can not be found');
       //Fetch the product(copy product memroy from blockchain )
       Product memory _product = products[_id];
       //Fetch the owner
       address _seller = _product.owner;
       //Make sure product is not purchased
       require(_product.purchased == false, 'the product has sold');
       //Require that there is enough Ether in the transaction
       require(msg.value >= _product.price, 'You do not send enough ether to purchase this product.');
       //Require that the buyer is not the seller
       require(_seller != msg.sender, 'You are the owner of this product.');
       //Transfer ownership to the buyer
       _product.owner = address(msg.sender);
       //Mark as purchased
       _product.purchased = true;
       //Update the product
       products[_id] = _product;
       //Pay the seller by sending them Ether
       payable(_seller).transfer(msg.value);
       //Trigger an event
       emit ProductCreated(_id, _product.name, _product.price, msg.sender, true);
   }

  

}