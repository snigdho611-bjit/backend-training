const http = require("http");
const path = require("path");
const fs = require("fs");

const server = http.createServer(function (req, res) {
  let body = "";
  req.on("data", (buffer) => {
    body += buffer;
  });
  req.on("end", () => {
    console.log(req.url, req.method);
    if (req.url === "/products/all" && req.method === "GET") {
      try {
        fs.readFile(
          path.join(__dirname, "data", "products.json"),
          (err, data) => {
            if (!err) {
              const jsonData = JSON.parse(data);
              res.writeHead(200, { "Content-Type": "application/json" });
              res.write(
                JSON.stringify({
                  success: true,
                  message: "Successfully got all products",
                  data: jsonData,
                })
              );
              return res.end();
            } else {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.write(
                JSON.stringify({
                  success: false,
                  message: "Failed to get files from server",
                })
              );
              return res.end();
            }
          }
        );
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.write(
          JSON.stringify({
            success: false,
            message: "Internal server error",
          })
        );
      }
    } else if (req.url === "/products/create" && req.method === "POST") {
      try {
        const { title, description, price, rating, stock } = JSON.parse(body);

        console.log("first");
        fs.readFile(
          path.join(__dirname, "data", "products.json"),
          (err, data) => {
            if (!err) {
              fs.writeFile(
                path.join(__dirname, "data", "products.json"),
                JSON.stringify({ text: 123 }),
                { encoding: "utf-8" },
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
              res.writeHead(500, { "Content-Type": "application/json" });
              res.write(
                JSON.stringify({
                  success: false,
                  message: "Failed to get files from server",
                })
              );
              return res.end();
            }
          }
        );
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.write(
          JSON.stringify({
            success: false,
            message: "Internal server error",
          })
        );
      }
    }
  });
});

server.listen(8000, () => {
  console.log("Server is running on 8000...");
});
