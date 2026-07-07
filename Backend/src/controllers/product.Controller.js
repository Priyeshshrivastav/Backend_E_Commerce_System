const productModel = require("../models/product.models");

// logic productcreate
async function product(req, res) {
  try {
    // 1. get all data from req.body
    const { name, description, price, stock, category, image } = req.body;

    //2. check all required filed are present or not

    if (!name || !price || !stock) {
      return res.status(400).send({ message: "required filed are missing " });
    }

    // 3. check product already exist or not ?
    const isAlreadyExist = await productModel.findOne({ name });

    if (isAlreadyExist) {
      return res.status(400).send({ message: "product already exist" });
    }

    // 4. create a new product into -> db
    const product = await productModel.create({
      name,
      description,
      price,
      stock,
      category,
      image,
    });

    // 5 send a response
    return res.status(200).send({ message: "product created successfully" });
  } catch (err) {
    console.log(err);
    return res.status(404).send({ message: "Internal server error" });
  }
}

// logic get all product
async function getproduct(req, res) {
  try {
    // 1. excess all data from database useing find()
    const product = await productModel.find();

    // 2. check is it exist or not in -> db
    if (product.length === 0) {
      return res.status(400).send({ message: "no product found" });
    }

    // 3. if found the fetch and print product
    return res
      .status(200)
      .send({
        message: "Product fetch sucessfully",
        totalproduct: product.length,
        product,
      });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "internal server error" });
  }
}

// logic for updateProduct
async function UpdateProduct(req, res) {
  try {
    // 1. get all product id from -req.params
    const id = req.params.id;

    //  2. get all products from req.body
    const { name, description, price, stock, category, image } = req.body;

    // 3. check product already existe or not
    const products = await productModel.findById(id);
    if (!products) {
      return res.status(404).send({ message: "Product not found" });
    }

    // 4. if found then  update data
    const updateProduct = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        stock,
        category,
        image,
      },
      {
        new: true,
      },
    );

    // send a res
    return res
      .status(200)
      .send({ message: "Product update Sucessfully", product: updateProduct });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "internal server error" });
  }
}

// logic for deleteProduct
async function DeleteProduct(req, res) {
  try {
    // 1. get product id -> req.params.id
    const id = req.params.id;

    // 2. check product id exist or not
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).send({ mesage: "Product not found" });
    }

    // 3. product exist then delete
    await productModel.findByIdAndDelete(id);

    // return res
    return res
      .status(200)
      .send({ message: "Product deleted sucessfully", product: product });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Internal server error" });
  }
}

module.exports = { product, getproduct, UpdateProduct, DeleteProduct};
