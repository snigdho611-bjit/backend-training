const { validationResult } = require("express-validator");
const HTTP_STATUS = require("../constants/statusCodes");
const ProductModel = require("../model/Product");
const { success, failure } = require("../util/common");

class ProductController {
    async getAll(req, res) {
        try {
            const {
                sortParam,
                sortOrder,
                search,
                brand,
                category,
                price,
                priceFil,
                stock,
                stockFil,
                rating,
                ratingFil,
                page,
                limit,
            } = req.query;
            if (page < 1 || limit < 0) {
                return res
                    .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
                    .send(failure("Page and limit values must be at least 1"));
            }
            if (
                (sortOrder && !sortParam) ||
                (!sortOrder && sortParam) ||
                (sortParam &&
                    sortParam !== "title" &&
                    sortParam !== "discountPercentage" &&
                    sortParam !== "rating" &&
                    sortParam !== "stock" &&
                    sortParam !== "price") ||
                (sortOrder && sortOrder !== "asc" && sortOrder !== "desc")
            ) {
                return res
                    .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
                    .send(failure("Invalid sort parameters provided"));
            }
            const filter = {};

            if (price && priceFil) {
                if (priceFil === "low") {
                    filter.price = { $lte: parseFloat(price) };
                } else {
                    filter.price = { $gte: parseFloat(price) };
                }
            }
            if (stock && stockFil) {
                if (stockFil === "low") {
                    filter.stock = { $lte: parseFloat(stock) };
                } else {
                    filter.stock = { $gte: parseFloat(stock) };
                }
            }
            if (rating && ratingFil) {
                if (ratingFil === "low") {
                    filter.rating = { $lte: parseFloat(rating) };
                } else {
                    filter.rating = { $gte: parseFloat(rating) };
                }
            }
            if (brand) {
                filter.brand = { $regex: brand, $options: "i" };
            }
            if (category) {
                filter.category = { $in: category.toLowerCase() };
            }
            if (search) {
                filter["$or"] = [
                    { description: { $regex: search, $options: "i" } },
                    { title: { $regex: search, $options: "i" } },
                ];
            }
            const productCount = await ProductModel.find({}).count();
            const products = await ProductModel.find(filter)
                .sort({
                    [sortParam]: sortOrder === "asc" ? 1 : -1,
                })
                .skip((page - 1) * limit)
                .limit(limit ? limit : 100);
            if (products.length === 0) {
                return res.status(HTTP_STATUS.NOT_FOUND).send(failure("No products were found"));
            }

            return res.status(HTTP_STATUS.OK).send(
                success("Successfully got all products", {
                    total: productCount,
                    count: products.length,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    products: products,
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

module.exports = new ProductController();
