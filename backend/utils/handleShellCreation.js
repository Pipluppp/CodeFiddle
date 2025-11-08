const processOutput = require("./processOutput");

const BOOTSTRAP_DELAY_MS = 300;
const BOOTSTRAP_COMMANDS = [
  'echo "Bootstrapping playground: installing dependencies and starting Vite dev server..."',
  // Enable polling so Docker bind mounts on macOS/Windows propagate file changes to Vite.
  "export CHOKIDAR_USEPOLLING=1",
  "export CHOKIDAR_INTERVAL=300",
  "cd /home/codefiddle/code",
  "npm install",
  "npm run dev -- --host",
];

const bootstrapDevServer = (stream) => {
  setTimeout(() => {
    // Run the usual setup commands automatically so the preview starts without manual input.
    BOOTSTRAP_COMMANDS.forEach((command) => {
      stream.write(`${command}\n`);
    });
  }, BOOTSTRAP_DELAY_MS);
};

const handleShellCreation = (container, ws) => {
  container.exec(
    {
      Cmd: ["/bin/bash"],
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      User: "codefiddle",
    },
    (err, exec) => {
      if (err) {
        console.log(err);
        ws.close();
        return;
      }

      exec.start(
        {
          stdin: false,
          hijack: true,
        },
        (err, stream) => {
          if (err) {
            console.log(err);
            ws.close();
            return;
          }

          processOutput(stream, ws);
          bootstrapDevServer(stream);

          ws.on("message", (message) => {
            stream.write(message);
          });
        }
      );
    }
  );
};

module.exports = handleShellCreation;
