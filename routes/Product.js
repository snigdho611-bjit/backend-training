const express = require("express");
const routes = express();
const { userValidator } = require("../middleware/validation");
const ProductController = require("../controller/ProductController");

routes.get("/all", ProductController.getAll);

module.exports = routes;
