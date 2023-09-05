const express = require("express");
const routes = express();
const { userValidator, productValidator } = require("../middleware/validation");
const ProductController = require("../controller/ProductController");
const { isAuthorized, isAdmin } = require("../middleware/auth");

routes.get("/all", isAuthorized, isAdmin, ProductController.getAll);
routes.post("/create", productValidator.add, ProductController.create);

module.exports = routes;
