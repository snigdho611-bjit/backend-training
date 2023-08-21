var http = require("http");

// create a server object:
http
  .createServer(function (req, res) {
    if (req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/json" });
      res.write(JSON.stringify({ message: "Hello World!" }));
      return res.end();
    }
  })
  .listen(8080);
