const { validationResult } = require("express-validator");
const { failure, success } = require("../util/common");
const HTTP_STATUS = require("../constants/statusCodes");
const CartModel = require("../model/Cart");
const ProductModel = require("../model/Product");
const UserModel = require("../model/User");

class CartController {
    async getCart(req, res) {
        try {
            const { userId } = req.params;
            const user = await UserModel.findById({ _id: userId });
            if (!user) {
                return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User does not exist"));
            }
            const cart = await CartModel.findOne({ user: userId }).populate("products.product");
            if (!cart) {
                return res
                    .status(HTTP_STATUS.NOT_FOUND)
                    .send(failure("Cart does not exist for user"));
            }
            return res.status(HTTP_STATUS.OK).send(success("Successfully got cart for user", cart));
        } catch (error) {
            console.log(error);
            return res
                .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .send(failure("Internal server error"));
        }
    }

    async addProductToCart(req, res) {
        try {
            const validation = validationResult(req).array();
            if (validation.length > 0) {
                return res
                    .status(HTTP_STATUS.OK)
                    .send(failure("Failed to add the product", validation));
            }

            const { userId, productId, amount } = req.body;

            const user = await UserModel.findById({ _id: userId });

            if (!user) {
                return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User does not exist"));
            }

            const cart = await CartModel.findOne({ user: userId });
            const product = await ProductModel.findById({ _id: productId });

            if (!product) {
                return res
                    .status(HTTP_STATUS.NOT_FOUND)
                    .send(failure("Product with ID was not found"));
            }

            if (product.stock < amount) {
                return res
                    .status(HTTP_STATUS.NOT_FOUND)
                    .send(failure("Not enough products are in stock"));
            }

            if (!cart) {
                const newCart = await CartModel.create({
                    user: userId,
                    products: [{ product: productId, quantity: amount }],
                    total: product.price * amount,
                });

                if (newCart) {
                    return res
                        .status(HTTP_STATUS.CREATED)
                        .send(success("Added item to newly created cart", newCart));
                }
            }

            const productIndex = cart.products.findIndex(
                (element) => String(element.product) === productId
            );
            if (productIndex !== -1) {
                if (product.stock < cart.products[productIndex].quantity + amount) {
                    return res
                        .status(HTTP_STATUS.NOT_FOUND)
                        .send(failure("Not enough products are in stock"));
                }
                cart.products[productIndex].quantity += amount;
            } else {
                cart.products.push({ product: productId, quantity: amount });
            }
            cart.total = cart.total + product.price * amount;

            await cart.save();
            return res
                .status(HTTP_STATUS.CREATED)
                .send(success("Added item to existing cart", cart));
        } catch (error) {
            console.log(error);
            return res
                .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .send(failure("Internal server error"));
        }
    }

    async removeProductFromCart(req, res) {
        try {
            const validation = validationResult(req).array();
            if (validation.length > 0) {
                return res
                    .status(HTTP_STATUS.OK)
                    .send(failure("Failed to remove the product", validation));
            }

            const { userId, productId, amount } = req.body;

            const user = await UserModel.findById({ _id: userId });

            if (!user) {
                return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User does not exist"));
            }

            const cart = await CartModel.findOne({ user: userId });

            if (!cart) {
                return res
                    .status(HTTP_STATUS.NOT_FOUND)
                    .send(failure("Cart was not found for this user"));
            }

            const product = await ProductModel.findById({ _id: productId });

            if (!product) {
                return res
                    .status(HTTP_STATUS.NOT_FOUND)
                    .send(failure("Product with ID was not found"));
            }

            const productExistIntex = cart.products.findIndex(
                (element) => String(element.product) === productId
            );
            if (productExistIntex === -1) {
                return res
                    .status(HTTP_STATUS.NOT_FOUND)
                    .send(failure("Product was not found in cart"));
            }

            if (cart.products[productExistIntex].quantity < amount) {
                return res
                    .status(HTTP_STATUS.NOT_FOUND)
                    .send(failure("Product does not exist in the cart enough times"));
            }

            if (cart.products[productExistIntex].quantity === amount) {
                cart.products.splice(productExistIntex, 1);
                cart.total = cart.total - amount * product.price;
                await cart.save();
                return res.status(HTTP_STATUS.OK).send(failure("Product removed from cart", cart));
            }

            if (cart.products[productExistIntex].quantity > amount) {
                cart.products[productExistIntex].quantity -= amount;
                cart.total = cart.total - amount * product.price;
                await cart.save();
                return res.status(HTTP_STATUS.OK).send(failure("Product reduced in cart", cart));
            }

            return res
                .status(HTTP_STATUS.CREATED)
                .send(success("Added item to existing cart", cart));
        } catch (error) {
            console.log(error);
            return res
                .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .send(failure("Internal server error"));
        }
    }
}

module.exports = new CartController();
