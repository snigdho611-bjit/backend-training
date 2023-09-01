const { validationResult } = require("express-validator");
const { success, failure } = require("../util/common");
const TransactionModel = require("../model/Transaction");
const HTTP_STATUS = require("../constants/statusCodes");

class Product {
    async getAll(req, res) {
        try {
            const { detail } = req.query;
            let transactions;
            // if (detail && detail != "1") {
            //     return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Invalid parameter sent"));
            // }

            // if (detail === "1") {
            //     transactions = await TransactionModel.find({})
            //         .populate("user", "-address")
            //         .populate("products", "-thumbnail");
            // } else {
            transactions = await TransactionModel.find({});
            // }
            if (transactions.length > 0) {
                return res.status(HTTP_STATUS.OK).send(
                    success("Successfully received all transactions", {
                        result: transactions,
                        total: transactions.length,
                    })
                );
            }
            return res.status(HTTP_STATUS.OK).send(success("No transactions were found"));
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
        }
    }

    async create(req, res) {
        try {
            const { user, products } = req.body;
            const newTransaction = await TransactionModel.create({ user, products });
            console.log(newTransaction);
            if (newTransaction) {
                return res.status(HTTP_STATUS.OK).send(
                    success("Successfully created new transaction", {
                        result: newTransaction,
                    })
                );
            }
            return res.status(HTTP_STATUS.OK).send(success("Failed to add transaction"));
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
        }
    }
}

module.exports = new Product();
