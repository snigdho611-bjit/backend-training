const express = require("express");
const routes = express();
const ProductController = require("../controller/ProductController");
const createValidation = require("../middleware/validation");

routes.get("/", ProductController.getAll);

module.exports = routes;
