const http = require("http");
const { success, failure } = require("./util/common");
const Product = require("./product");

const server = http.createServer(function (req, res) {
  const getQueryParams = () => {
    const params = new URLSearchParams(req.url.split("?")[1]);
    const queryParams = {};
    for (const param of params) {
      queryParams[param[0]] = param[1];
    }
    return queryParams;
  };
  let body = "";
  req.on("data", (buffer) => {
    body += buffer;
  });
  req.on("end", async () => {
    console.log(req.url, req.method);
    res.setHeader("Content-Type", "application/json");

    const requestURL = req.url.split("?")[0];

    //Get All Products
    if (requestURL === "/products/all" && req.method === "GET") {
      try {
        const result = await Product.getAll();
        if (result.success) {
          res.writeHead(200);
          res.write(success("Successfully got all products", JSON.parse(result.data)));
          return res.end();
        } else {
          res.writeHead(400);
          res.write(failure("Failed to get products"));
          return res.end();
        }
      } catch (error) {
        console.log(error);
        res.writeHead(500);
        res.write(failure("Internal server error"));
        return res.end();
      }
    }
    // Create One Product
    else if (requestURL === "/products/create" && req.method === "POST") {
      try {
        const result = await Product.add(body);
        if (result && result.errors) {
          res.writeHead(400);
          res.write(failure("Failed to add product", result.errors));
          res.end();
        } else {
          res.writeHead(200);
          res.write(success("Added to file successfully", JSON.parse(body)));
          res.end();
        }
      } catch (error) {
        console.log(error);
        res.writeHead(500);
        res.write(failure("Internal server error"));
        return res.end();
      }
    } else if (requestURL === "/products/detail" && req.method === "GET") {
      try {
        const result = await Product.getOneById(getQueryParams().id);
        if (result.success) {
          res.writeHead(200);
          res.write(success("Found data successfully", result.data));
          res.end();
        } else {
          res.writeHead(400);
          res.write(failure("Could not find data"));
          return res.end();
        }
      } catch (error) {
        console.log(error);
        res.writeHead(500);
        res.write(failure("Internal server error"));
        return res.end();
      }
    } else {
      res.writeHead(500);
      res.write(failure("Route does not exist"));
      return res.end();
    }
  });
});

server.listen(8000, () => {
  console.log("Server is running on 8000...");
});
