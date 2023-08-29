const ProductModel = require("../model/Product");
const { success } = require("../util/common");

class Product {
  async getAll(req, res) {
    try {
      const products = await ProductModel.getAll();
      return res.status(200).send(success("Successfully received all products", products));
    } catch (error) {
      return res.status(500).send(failure("Internal server error"));
    }
  }
}

module.exports = new Product();
