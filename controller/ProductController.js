const { validationResult } = require("express-validator");
const ProductModel = require("../model/Product");
const { success, failure } = require("../util/common");

class Product {
  async getAll(req, res) {
    try {
      const products = await ProductModel.getAll();
      return res.status(200).send(success("Successfully received all products", products));
    } catch (error) {
      return res.status(500).send(failure("Internal server error"));
    }
  }

  async getOneById(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductModel.getOneById(id);
      if (product.success) {
        return res.status(200).send(success("Successfully received the product", product.data));
      } else {
        return res.status(200).send(failure("Failed to received the product"));
      }
    } catch (error) {
      return res.status(500).send(failure("Internal server error"));
    }
  }

  async create(req, res) {
    try {
      const validation = validationResult(req).array();
      console.log(validation);
      if (validation.length === 0) {
        const product = req.body;
        const result = await ProductModel.add(product);
        if (result.success) {
          return res.status(200).send(success("Successfully added the product", product.data));
        } else {
          return res.status(200).send(failure("Failed to add the product"));
        }
      } else {
        return res.status(422).send(failure("Invalid inputs provided", validation));
      }
    } catch (error) {
      return res.status(500).send(failure("Internal server error"));
    }
  }
}

module.exports = new Product();
