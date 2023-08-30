const express = require("express");
const routes = express();
const ProductController = require("../controller/ProductController");
const validator = require("../middleware/validation");

routes.get("/", ProductController.getAll);
routes.get("/detail/:id", ProductController.getOneById);
routes.post("/create", validator.create, ProductController.create);

module.exports = routes;
