const express = require("express");
const routes = express();
const TransactionController = require("../controller/TransactionController");

routes.get("/all", TransactionController.getAll);
routes.post("/create", TransactionController.create);

module.exports = routes;
