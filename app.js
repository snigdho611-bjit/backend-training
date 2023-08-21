var http = require("http");

// create a server object:

const server = http.createServer(function (req, res) {
  if (req.url === "/" && req.method === "GET") {
    // console.log(req)
    res.writeHead(200, { "Content-Type": "text/json" });
    res.write(JSON.stringify({ message: "Hello World!" }));
    return res.end();
  }
});

server.listen(8000, () => {
  console.log("Server is running on 8000...");
});
