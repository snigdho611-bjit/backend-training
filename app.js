const http = require("http");
const { success, failure } = require("./util/common");
const Product = require("./model/Product");

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

    // Get All Products
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

    // Get One Product By Id
    else if (requestURL === "/products/detail" && req.method === "GET") {
      try {
        const id = getQueryParams().id;
        if (id) {
          const result = await Product.getOneById(id);
          if (result.success) {
            res.writeHead(200);
            res.write(success("Fetched product successfully", result.data));
            return res.end();
          } else {
            res.writeHead(200);
            res.write(success("Product with id does not exist"));
            return res.end();
          }
        } else {
          res.writeHead(404);
          res.write(failure("Id was not provided"));
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
        if (result && !result.success && result.errors) {
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
    }

    // Update One Product
    else if (requestURL === "/products/update" && req.method === "PUT") {
      try {
        const id = getQueryParams().id;
        const result = await Product.updateById(id, body);
        console.log(result);
        if (!result.success) {
          res.writeHead(400);
          res.write(failure("Failed to update product", result.errors));
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
    }

    // Get One Product By Id
    else if (requestURL === "/products/delete" && req.method === "DELETE") {
      try {
        const id = getQueryParams().id;
        const result = await Product.deletetById(id);
        if (result.success) {
          res.writeHead(200);
          res.write(success(`Deleted data successfully with id: ${id}`));
          return res.end();
        } else {
          res.writeHead(200);
          res.write(success("Product with id does not exist"));
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
