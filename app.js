const express = require("express");
const app = express();
const { success } = require("./util/common");

app.use(express.json()); // Parses data as JSON
app.use(express.text()); // Parses data as text
app.use(express.urlencoded({ extended: true })); // Parses data as urlencoded

app.get("/products", (req, res) => {
  return res.status(200).send({ message: "Successfully received get request" });
});

app.get("/products/:category/:productId", (req, res) => {
  const { category, productId } = req.params;
  return res
    .status(200)
    .send({ message: "GET request successful", data: { category: category, productId: productId } });
});

app.post("/products", (req, res) => {
  console.log(req.body);
  return res.status(200).send({ message: "POST request successful", data: req.body });
});

// Route to handle all other invalid requests
app.use((req, res) => {
  return res.status(400).send({ message: "Not found" });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
