const { success, failure, sendResponse } = require("../util/common");
const TransactionModel = require("../model/Transaction");
const CartModel = require("../model/Cart");
const ProductModel = require("../model/Product");
const HTTP_STATUS = require("../constants/statusCodes");

class TransactionController {
    async getAll(req, res) {
        try {
            const { detail } = req.query;
            let transactions;
            if (detail && detail != "1") {
                return sendResponse(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, "Invalid parameter sent");
            }

            if (detail === "1") {
                transactions = await TransactionModel.find({})
                    .populate("user", "name email")
                    .populate("products.product", "title description price rating brand")
                    .select("-__v");
            } else {
                transactions = await TransactionModel.find({});
            }
            if (transactions.length > 0) {
                return sendResponse(res, HTTP_STATUS.OK, "Successfully received all transactions", {
                    result: transactions,
                    total: transactions.length,
                });
            }
            return sendResponse(res, HTTP_STATUS.OK, "No transactions were found");
        } catch (error) {
            console.log(error);
            return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }

    async create(req, res) {
        try {
            const { userId, cartId } = req.body;
            const cart = await CartModel.findOne({ _id: cartId, user: userId });

            if (!cart) {
                return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Cart was not found for this user");
            }

            if (cart.products.length === 0) {
                return sendResponse(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, "Please add products to cart first");
            }

            const productsList = cart.products.map((element) => {
                return element.product;
            });

            const productsInCart = await ProductModel.find({
                _id: {
                    $in: productsList,
                },
            });

            if (productsList.length !== productsInCart.length) {
                return sendResponse(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, "All products in cart do not exist");
            }

            productsInCart.forEach((product) => {
                const productFound = cart.products.findIndex(
                    (cartItem) => String(cartItem.product._id) === String(product._id)
                );
                if (product.stock < cart.products[productFound].quantity) {
                    return sendResponse(
                        res,
                        HTTP_STATUS.NOT_FOUND,
                        "Unable to check out at this time, product does not exist"
                    );
                }
                product.stock -= cart.products[productFound].quantity;
            });

            const bulk = [];
            productsInCart.map((element) => {
                bulk.push({
                    updateOne: {
                        filter: { _id: element },
                        update: { $set: { stock: element.stock } },
                    },
                });
            });

            const stockSave = await ProductModel.bulkWrite(bulk);
            const newTransaction = await TransactionModel.create({
                products: cart.products,
                user: userId,
                total: cart.total,
            });

            cart.products = [];
            cart.total = 0;
            const cartSave = await cart.save();

            if (cartSave && stockSave && newTransaction) {
                return sendResponse(res, HTTP_STATUS.OK, "Successfully checked out!", newTransaction);
            }

            return sendResponse(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, "Something went wrong");
        } catch (error) {
            console.log(error);
            return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }
}

module.exports = new TransactionController();
