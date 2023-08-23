const http = require("http");
const path = require("path");
const fs = require("fs");
const { success, failure } = require("./util/common");

const server = http.createServer(function (req, res) {
  let body = "";
  req.on("data", (buffer) => {
    body += buffer;
  });
  req.on("end", () => {
    console.log(req.url, req.method);
    res.setHeader("Content-Type", "application/json");
    if (req.url === "/products/all" && req.method === "GET") {
      try {
        fs.readFile(
          path.join(__dirname, "data", "products.json"),
          (err, data) => {
            if (!err) {
              const jsonData = JSON.parse(data);
              res.writeHead(200);
              res.write(success("Successfully got all products", jsonData));
              res.end();
            } else {
              res.writeHead(500);
              res.write(failure("Failed to get files from server"));
              return res.end();
            }
          }
        );
      } catch (error) {
        res.writeHead(500);
        res.write(failure("Internal server error"));
        return res.end();
      }
    } else if (req.url === "/products/create" && req.method === "POST") {
      try {
        const { title, description, price, rating, stock } = JSON.parse(body);

        const errors = {};
        if (!title || title === "") {
          errors.title = "Title was not provided";
        }
        if (!description || description === "" || description.length <= 10) {
          errors.description =
            "Description should be provided, and it should be at least 15 characters long";
        }
        if (!price || price <= 100) {
          errors.price =
            "Price should be provided, and it should be at least 100";
        }
        if (!rating || rating > 5 || rating < 0) {
          errors.rating = "Rating should be provided between 0 and 5";
        }
        if (!stock || stock <= 100) {
          errors.stock = "Stock should be provided greater than 0";
        }

        if (Object.keys(errors).length > 0) {
          res.writeHead(400);
          res.write(failure("Failed to process request due to inputs", errors));
          return res.end();
        }

        fs.readFile(
          path.join(__dirname, "data", "products.json"),
          (err, data) => {
            if (!err) {
              fs.writeFile(
                path.join(__dirname, "products.json"),
                JSON.stringify({ text: 123 }),
                { encoding: "utf-8", flag: "r+" },
                (error) => {
                  if (error) {
                    console.log(error);
                  } else {
                    // console.log("No error");
                    // const body =
                  }
                }
              );
            } else {
              res.writeHead(500);
              res.write(failure("Failed to get files from server"));
              return res.end();
            }
          }
        );
      } catch (error) {
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
