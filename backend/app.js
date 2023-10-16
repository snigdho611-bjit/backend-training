const express = require("express");
const cors = require("cors");
const app = express();
const UserRouter = require("./routes/User");
const ProductRouter = require("./routes/Product");
const TransactionRouter = require("./routes/Transaction");
const AuthRouter = require("./routes/Auth");
const CartRouter = require("./routes/Cart");
const MailRouter = require("./routes/Mail");
const dotenv = require("dotenv");
const databaseConnection = require("./config/database");
const path = require("path");
const multer = require("multer");
const { sendResponse } = require("./util/common");
const data = require("./data/homepage");
const HTTP_STATUS = require("./constants/statusCodes");

dotenv.config();

app.use(cors({ origin: "*" }));
app.use(express.json()); // Parses data as JSON
app.use(express.text()); // Parses data as text
app.use(express.urlencoded({ extended: true })); // Parses data as urlencoded

app.use("/products", ProductRouter);
app.use("/transactions", TransactionRouter);
app.use("/users", UserRouter);
app.use("/auth", AuthRouter);
app.use("/cart", CartRouter);
app.use("/mail", MailRouter);

// CUSTOM ERROR HANDLER FOR MULTER
app.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return sendResponse(res, HTTP_STATUS.REQUEST_ENTITY_TOO_LARGE, "File should be below 500 megabytes");
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return sendResponse(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, "File was received in an unexpected manner");
    }
    // console.log(err.code);
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return sendResponse(res, 404, err.message);
  }
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./", "views"));

databaseConnection(() => {
  app.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
});
