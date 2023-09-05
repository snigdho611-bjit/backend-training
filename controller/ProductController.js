const { validationResult } = require("express-validator");
const HTTP_STATUS = require("../constants/statusCodes");
const ProductModel = require("../model/Product");
const { success, failure } = require("../util/common");

class Product {
    async getAll(req, res) {
        try {
            const allProducts = await ProductModel.find({}).sort({ createdAt: -1 });
            if (allProducts.length === 0) {
                return res.status(HTTP_STATUS.NOT_FOUND).send(failure("No products were found"));
            }
            return res
                .status(HTTP_STATUS.OK)
                .send(
                    success("Successfully got all products", {
                        products: allProducts,
                        total: allProducts.length,
                    })
                );
        } catch (error) {
            console.log(error);
            return res
                .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .send(failure("Internal server error"));
        }
    }

    async create(req, res) {
        try {
            const validation = validationResult(req).array();
            if (validation.length > 0) {
                return res
                    .status(HTTP_STATUS.OK)
                    .send(failure("Failed to add the product", validation));
            }
            const { title, description, price, stock, brand } = req.body;

            const existingProduct = await ProductModel.findOne({ title: title });

            if (existingProduct) {
                return res
                    .status(HTTP_STATUS.NOT_FOUND)
                    .send(failure("Product with same title already exists"));
            }

            const newProduct = await ProductModel.create({
                title: title,
                description: description,
                price: price,
                stock: stock,
                brand: brand,
            });
            console.log(newProduct);
            if (newProduct) {
                return res
                    .status(HTTP_STATUS.OK)
                    .send(success("Successfully added product", newProduct));
            }
        } catch (error) {
            console.log(error);
            return res
                .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .send(failure("Internal server error"));
        }
    }
}

module.exports = new Product();
