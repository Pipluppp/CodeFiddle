const https = require("https");
const fs = require("fs");
const os = require("os");

const port = Number(process.env.PORT) || 3000;

const options = {
  key: fs.readFileSync("/certs/privkey.pem"),
  cert: fs.readFileSync("/certs/fullchain.pem")
};

const server = https.createServer(options, (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from the CodeFiddle Node template!\n");
});

server.listen(port, () => {
  console.log(`Server running at https://localhost:${port}`);
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
