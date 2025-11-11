const processOutput = require("./processOutput");
const getTemplateForPlayground = require("./getTemplateForPlayground");

const FALLBACK_BOOTSTRAP_DELAY_MS = 300;
const FALLBACK_BOOTSTRAP_COMMANDS = [
  'echo "Bootstrapping playground: installing dependencies and starting the dev server..."',
  "export CHOKIDAR_USEPOLLING=1",
  "export CHOKIDAR_INTERVAL=300",
  "cd /home/codefiddle/code",
  "npm install",
  "npm run dev",
];

const bootstrapDevServer = (stream, template) => {
  const shellConfig = template?.shell;

  if (!shellConfig?.autoBootstrap) {
    return;
  }

  const commands = shellConfig.commands?.length
    ? shellConfig.commands
    : FALLBACK_BOOTSTRAP_COMMANDS;
  const delay = shellConfig.bootstrapDelayMs ?? FALLBACK_BOOTSTRAP_DELAY_MS;

  setTimeout(() => {
    commands.forEach((command) => {
      stream.write(`${command}\n`);
    });
  }, delay);
};

const handleShellCreation = (container, ws, playgroundId) => {
  const resolvedPlaygroundId = playgroundId || container?.name?.replace(/^\//, "");
  const template = getTemplateForPlayground(resolvedPlaygroundId);

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
          bootstrapDevServer(stream, template);

          ws.on("message", (message) => {
            stream.write(message);
          });
        }
      );
    }
  );
};

module.exports = handleShellCreation;
