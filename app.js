const http = require("http");
const path = require("path");
const fs = require("fs");

const server = http.createServer(function (req, res) {
  let body = "";
  req.on("data", (buffer) => {
    body += buffer;
  });
  req.on("end", () => {
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
    }
  });
});

server.listen(8000, () => {
  console.log("Server is running on 8000...");
});
