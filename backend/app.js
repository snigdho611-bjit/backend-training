const express = require("express");
const cors = require("cors");
const app = express();
const UserRouter = require("./routes/User");
const ProductRouter = require("./routes/Product");
const TransactionRouter = require("./routes/Transaction");
const AuthRouter = require("./routes/Auth");
const CartRouter = require("./routes/Cart");
const FileRouter = require("./routes/File");
const MailRouter = require("./routes/Mail");
const dotenv = require("dotenv");
const databaseConnection = require("./config/database");
const path = require("path");
const multer = require("multer");
const { sendResponse } = require("./util/common");

dotenv.config();

app.use(cors({ origin: "*" }));
app.use(express.json()); // Parses data as JSON
app.use(express.text()); // Parses data as text
app.use(express.urlencoded({ extended: true })); // Parses data as urlencoded

const prefix = "/api";
app.use(`${prefix}/products`, ProductRouter);
app.use(`${prefix}/users`, UserRouter);
app.use(`${prefix}/transactions`, TransactionRouter);
app.use(`${prefix}/auth`, AuthRouter);
app.use(`${prefix}/mail`, MailRouter);
app.use(`${prefix}/cart`, CartRouter);
app.use(`${prefix}/files`, FileRouter);

app.use((err, req, res, next) => {
    console.log(err);
    if (err instanceof multer.MulterError) {
        return sendResponse(res, 404, err.message);
    } else {
        next(err);
    }
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./", "views"));

databaseConnection(() => {
    app.listen(8000, () => {
        console.log("Server is running on port 8000");
    });
});
