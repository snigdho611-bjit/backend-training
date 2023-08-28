const express = require("express");
const app = express();
const { success } = require("./util/common");

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/products", (req, res) => {
  // console.log(req.body);
  return res.status(200).send(success("Request successfully received", { data: { text: 123 } }));
});

app.get("/school/detail/:course/:chapter", (req, res) => {
  const { id, name } = req.params;
  console.log(req.params);
  return res.status(200).send({ message: "GET request successful" });
});

app.post("/products", (req, res) => {
  console.log(req.body);
  return res.status(200).send({ message: "POST request successful" });
  // return res.statusCode(200);
});

app.use((req, res) => {
  return res.status(400).send({ message: "Not found" });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
