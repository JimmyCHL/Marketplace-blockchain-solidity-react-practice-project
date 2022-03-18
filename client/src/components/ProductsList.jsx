import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import web3 from "web3";

const ProductsList = ({ products, purchaseProduct }) => {
  console.log(products);
  return (
    <>
      {products.map((product, index) => (
        <Col
          key={product.name + index}
          as={Row}
          xs={12}
          style={{ boxSizing: "border-box" }}
          className="border-bottom border-2 "
        >
          <h4 className="col-1 col-md-1 m-0 d-flex align-items-center fs-6">
            {product.id}
          </h4>
          <h4 className="col-3 col-md-2 m-0 d-flex align-items-center fs-6">
            {product.name}
          </h4>
          <h4 className="col-3 col-md-2 m-0 d-flex align-items-center fs-6">
            {web3.utils.fromWei(product.price)} ETH
          </h4>
          <h4
            style={{ whiteSpace: "nowrap" }}
            className="col-4 col-md-6 m-0 d-flex align-items-center fs-6 "
          >
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {product.owner}
            </span>
          </h4>
          <Button
            disabled={product.purchased}
            onClick={() => purchaseProduct(product.id, product.price)}
            className="col-10 mx-auto col-lg-1 my-2 bg-dark text-white"
          >
            {!product.purchased ? "Buy" : "Sold"}
          </Button>
        </Col>
      ))}
    </>
  );
};

export default ProductsList;
