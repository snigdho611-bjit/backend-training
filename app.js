const http = require("http");
// const { success, failure } = require("./util/common");
// const Product = require("./model/Product");

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
        // execute the code here...
      } catch (error) {
        console.log(error);
        res.writeHead(500);
        res.write({ message: "Internal server error" });
        return res.end();
      }
    }

  });
});

server.listen(8000, () => {
  console.log("Server is running on 8000...");
});
