const express = require("express");
const app = express();
const ProductRouter = require("./routes/Product");
const dotenv = require("dotenv");

dotenv.config();

app.use(express.json()); // Parses data as JSON
app.use(express.text()); // Parses data as text
app.use(express.urlencoded({ extended: true })); // Parses data as urlencoded

app.use("/products", ProductRouter);

app.listen(8000, () => {
  console.log(process.env.TEST_DB);
  console.log("Server is running on port 8000");
});
