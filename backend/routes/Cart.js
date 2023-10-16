const express = require("express");
const routes = express();
const { userValidator, productValidator, cartValidator } = require("../middleware/validation");
const ProductController = require("../controller/ProductController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const CartController = require("../controller/CartController");

routes.get("/:userId", isAuthenticated, CartController.getCart);
routes.post(
    "/add-product",
    // isAuthenticated,
    cartValidator.addRemoveItemCart,
    CartController.addProductToCart
);
routes.patch(
    "/remove-product",
    // isAuthenticated,
    cartValidator.addRemoveItemCart,
    CartController.removeProductFromCart
);

module.exports = routes;
