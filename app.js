const http = require("http");
const path = require("path");
const fs = require("fs");
const querystring = require("querystring");
const url = require("url");

// create a server object:

// Difference between application and text
// https://stackoverflow.com/questions/22406077/what-is-the-exact-difference-between-content-type-text-json-and-application-jso

const server = http.createServer(function (req, res) {
  let body = "";
  req.on("data", (buffer) => {
    body += buffer.toString();
  });

  res.writeHead(200, { "Content-Type": "text/json" });

  req.on("end", () => {
    req.body = body;
    if (req.url === "/products/all" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      console.log("Getting all products...");
      fs.readFile(
        path.join(__dirname, "data", "products.json"),
        (err, data) => {
          if (!err) {
            const jsonData = JSON.parse(data);
            res.write(JSON.stringify(jsonData));
            return res.end();
          }
        }
      );
    } else if (req.url === "/products/get" && req.method === "POST") {
      fs.readFile(
        path.join(__dirname, "data", "products.json"),
        (err, data) => {
          if (!err) {
            const reqBody = JSON.parse(req.body);
            const jsonData = JSON.parse(data);
            console.log(reqBody);
            const foundData = jsonData.filter((element) => {
              return element.id === reqBody.id;
            });
            if (foundData.length !== 0) {
              res.write(
                JSON.stringify({
                  data: foundData[0],
                  message: "Successfully got data",
                })
              );
            } else {
              res.write(
                JSON.stringify({
                  data: [],
                  message: "ID does not exist",
                })
              );
            }

            return res.end();
          }
        }
      );
    } else if (req.url === "/products/create" && req.method === "POST") {
      console.log(req.body);
    }
  });
});

server.listen(8000, () => {
  console.log("Server is running on 8000...");
});
