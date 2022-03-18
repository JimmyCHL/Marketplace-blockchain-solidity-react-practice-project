import React, { useState } from "react";
import { Button, Col, Form, Row, Container } from "react-bootstrap";
import ProductsList from "./ProductsList";
import web3 from "web3";

const Main = ({ createProduct, products, purchaseProduct }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    await createProduct(name, web3.utils.toWei(price, "ether"));
    console.log(`Your add ${name} with ${price} ETH.`);
  };

  return (
    <Container
      id="content"
      style={{ minHeight: "100vh" }}
      className="d-flex pb-2  align-items-center  flex-column shadow-lg"
    >
      <h1 className="text-center">Add Product</h1>
      <Form as="form" className="col-6" onSubmit={submitHandler}>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Product Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="w-100">
          Add Product
        </Button>
      </Form>
      <h1 className="text-center mt-3">Buy Product</h1>
      <Container fluid className="col-12 p-0">
        <Row className="align-items-center justify-content-center">
          <Col as={Row} xs={12} className="border-top border-bottom border-2 ">
            <h4 className="col-1 col-md-1 m-0 d-flex align-items-center">#</h4>
            <h4 className="col-3 col-md-2 m-0 d-flex align-items-center">
              Name
            </h4>
            <h4 className="col-3 col-md-2 m-0 d-flex align-items-center">
              Price
            </h4>
            <h4 className="col-4 col-md-6 m-0 d-flex align-items-center">
              Owner
            </h4>
          </Col>
          <ProductsList products={products} purchaseProduct={purchaseProduct} />
        </Row>
      </Container>
    </Container>
  );
};

export default Main;
