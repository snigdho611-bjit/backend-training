const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/json" });
  res.write(JSON.stringify({ message: "Hello Worlds!" }));
  res.end();
});

server.listen(8000, () => {
  console.log("Server is running on 8000...");
});
