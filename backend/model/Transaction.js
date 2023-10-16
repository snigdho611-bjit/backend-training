const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        products: {
            type: [
                {
                    product: {
                        type: mongoose.Types.ObjectId,
                        ref: "Product",
                        required: true,
                    },
                    quantity: Number,
                    _id: false,
                },
            ],
        },
        total: { type: Number, required: true },
        paymentMethod: {
            type: String,
            required: true,
            default: "online",
        },
    },
    { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
