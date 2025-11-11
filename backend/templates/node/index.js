const os = require("os");

const asciiRule = "=".repeat(48);

console.clear();
console.log(asciiRule);
console.log("🚀  Welcome to the Node.js playground!\n");
console.log("• Runtime:", process.version);
console.log("• Platform:", process.platform, os.arch());
console.log("• PID:", process.pid);
console.log(asciiRule);
console.log("This template runs a simple script that logs updates every few seconds.");
console.log("Edit index.js and save to see nodemon restart automatically.\n");

let ticks = 0;
setInterval(() => {
  ticks += 1;
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Heartbeat ${ticks}: Node is running smoothly.`);
}, 5000);
