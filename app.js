const express = require("express");
const cors = require("cors");
const app = express();
const UserRouter = require("./routes/User");
const ProductRouter = require("./routes/Product");
const TransactionRouter = require("./routes/Transaction");
const AuthRouter = require("./routes/Auth");
const CartRouter = require("./routes/Cart");
const dotenv = require("dotenv");
const databaseConnection = require("./config/database");
const path = require("path");

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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./", "views"));

app.get("/hello", (req, res) => {
    return res.render("hello.ejs", {
        name: "My E-commerce Platform",
        routes: [
            {
                url: "/products/all",
                description: "Gets all products",
                method: "GET",
                body: "N/A",
                response: JSON.stringify(
                    {
                        success: "boolean",
                        message: "string",
                        data: {
                            _id: "string",
                            title: "string",
                            price: "number",
                            rating: "float",
                            stock: "number",
                            brand: "string",
                            category: ["string"],
                            thumbnail: "string",
                        },
                    },
                    null,
                    "\t"
                ),
            },
            {
                url: "/products/create",
                description: "Creates new products",
                method: "POST",
                body: JSON.stringify(
                    {
                        title: "string",
                        description: "string",
                        price: "number",
                        stock: "number",
                        brand: "number",
                    },
                    null,
                    "\t"
                ),
                response: "N/A",
            },
        ],
    });
});

databaseConnection(() => {
    app.listen(8000, () => {
        console.log("Server is running on port 8000");
    });
});
