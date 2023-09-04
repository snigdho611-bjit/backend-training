const HTTP_STATUS = require("../constants/statusCodes");
const ProductModel = require("../model/Product");
const { success } = require("../util/common");

class Product {
    async getAll(req, res) {
        try {
            const allProducts = await ProductModel.find({});
            if (allProducts.length === 0) {
                return res.status(HTTP_STATUS.NOT_FOUND).send(failure("No products were found"));
            }
            return res.status(HTTP_STATUS.OK).send(success("Successfully got all products", allProducts));
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
        }
    }
}

module.exports = new Product();
