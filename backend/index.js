const { log } = require("console");
const http = require("http");
const server = http.createServer((req, res) => {
    log("Node servir is running");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("Hello world");
    res.end();
});
server.listen(8000);
