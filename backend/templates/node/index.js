const http = require("http");
const os = require("os");

const port = Number(process.env.PORT) || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from the CodeFiddle Node template!\n");
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Runtime: ${process.version}`);
  console.log(`Platform: ${process.platform} ${os.arch()}`);
  console.log("Edit index.js and save to trigger automatic restarts.");
});

server.on("error", (error) => {
  console.error("Server error:", error);
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("Received SIGINT. Closing server...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
