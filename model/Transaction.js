const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        products: {
            type: [mongoose.Types.ObjectId],
            ref: "Product",
            required: true,
        },
    },
    { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
