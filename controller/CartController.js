const { validationResult } = require("express-validator");
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
                return sendResponse(res, HTTP_STATUS.NOT_FOUND, "User does not exist");
            }
            const cart = await CartModel.findOne({ user: userId }).populate("products.product");
            if (!cart) {
                return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Cart does not exist for user");
            }
            return sendResponse(res, HTTP_STATUS.OK, "Successfully got cart for user", cart);
        } catch (error) {
            console.log(error);
            return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }

    async addProductToCart(req, res) {
        try {
            const validation = validationResult(req).array();
            if (validation.length > 0) {
                return sendResponse(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, "Failed to add the product", validation);
            }

            const { userId, productId, amount } = req.body;

            const user = await UserModel.findById({ _id: userId });

            if (!user) {
                return sendResponse(res, HTTP_STATUS.NOT_FOUND, "User does not exist");
            }

            const cart = await CartModel.findOne({ user: userId });
            const product = await ProductModel.findById({ _id: productId });

            if (!product) {
                return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Product with ID was not found");
            }

            if (product.stock < amount) {
                return sendResponse(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, "Not enough products are in stock");
            }

            if (!cart) {
                const newCart = await CartModel.create({
                    user: userId,
                    products: [{ product: productId, quantity: amount }],
                    total: product.price * amount,
                });

                if (newCart) {
                    return sendResponse(res, HTTP_STATUS.OK, "Added item to existing cart", newCart);
                }
            }

            const productIndex = cart.products.findIndex((element) => String(element.product) === productId);
            if (productIndex !== -1) {
                if (product.stock < cart.products[productIndex].quantity + amount) {
                    return sendResponse(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, "Not enough products are in stock");
                }
                cart.products[productIndex].quantity += amount;
            } else {
                cart.products.push({ product: productId, quantity: amount });
            }
            cart.total = cart.total + product.price * amount;

            await cart.save();
            return sendResponse(res, HTTP_STATUS.CREATED, "Added item to existing cart", cart);
        } catch (error) {
            console.log(error);
            return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }

    async removeProductFromCart(req, res) {
        try {
            const validation = validationResult(req).array();
            if (validation.length > 0) {
                return sendResponse(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, "Failed to remove the product", validation);
            }

            const { userId, productId, amount } = req.body;

            const user = await UserModel.findById({ _id: userId });

            if (!user) {
                return sendResponse(res, HTTP_STATUS.NOT_FOUND, "User does not exist");
            }

            const cart = await CartModel.findOne({ user: userId });

            if (!cart) {
                return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Cart was not found for this user");
            }

            const product = await ProductModel.findById({ _id: productId });

            if (!product) {
                return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Product with ID was not found");
            }

            const productExistIntex = cart.products.findIndex((element) => String(element.product) === productId);
            if (productExistIntex === -1) {
                return sendResponse(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, "Product was not found in cart");
            }

            if (cart.products[productExistIntex].quantity < amount) {
                return sendResponse(
                    res,
                    HTTP_STATUS.UNPROCESSABLE_ENTITY,
                    "Product does not exist in the cart enough times"
                );
            }

            if (cart.products[productExistIntex].quantity === amount) {
                cart.products.splice(productExistIntex, 1);
                cart.total = cart.total - amount * product.price;
                await cart.save();
                return sendResponse(res, HTTP_STATUS.OK, "Product removed from cart", cart);
            }

            if (cart.products[productExistIntex].quantity > amount) {
                cart.products[productExistIntex].quantity -= amount;
                cart.total = cart.total - amount * product.price;
                await cart.save();
                return sendResponse(res, HTTP_STATUS.OK, "Product reduced in cart", cart);
            }
        } catch (error) {
            console.log(error);
            return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }
}

module.exports = new CartController();
