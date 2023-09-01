const { validationResult } = require("express-validator");
const { success, failure } = require("../util/common");
const ProductModel = require("../model/Product");
const HTTP_STATUS = require("../constants/statusCodes");

class Product {
    async getAll(req, res) {
        try {
            const products = await ProductModel.find({}).limit(50).exec();
            if (products.length > 0) {
                return res.status(HTTP_STATUS.OK).send(
                    success("Successfully received all products", {
                        result: products,
                        total: products.length,
                    })
                );
            }
            return res.status(HTTP_STATUS.OK).send(success("No products were found"));
        } catch (error) {
            console.log(error);
            return res
                .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .send(failure("Internal server error"));
        }
    }
}

module.exports = new Product();
