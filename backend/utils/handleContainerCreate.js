const path = require("path");
const Docker = require("dockerode");

const getTemplateForPlayground = require("./getTemplateForPlayground");

const docker = new Docker();

const handleContainerCreate = (playgroundId, wsForShell, req, socket, head) => {
  const template = getTemplateForPlayground(playgroundId);
  const previewConfig = template?.preview || {};
  const previewEnabled = Boolean(previewConfig.enabled && previewConfig.port);
  const privatePort = previewConfig.port;

  const hostConfig = {
    Binds: [
      `${path.resolve(
        __dirname + "/../playgrounds/" + playgroundId + "/code"
      )}:/home/codefiddle/code`,
      `${path.resolve(__dirname + "/../certs")}:/certs:ro`,
    ],
  };

  if (previewEnabled) {
    hostConfig.PortBindings = {
      [`${privatePort}/tcp`]: [{ HostPort: "0" }],
    };
  }

  // 1. Determine the Host. Default to localhost if not set.
  const hmrHost = process.env.VITE_HMR_HOST || "localhost";

  const containerConfig = {
    Image: "codefiddle",
    name: playgroundId,
    AttachStderr: true,
    AttachStdin: true,
    AttachStdout: true,
    Cmd: [
      "/bin/sh",
      "-c",
      "chown -R codefiddle:codefiddle /home/codefiddle/code && /bin/bash",
    ],
    Tty: true,
    Env: [
      `VITE_HMR_HOST=${hmrHost}`,
      "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
      "CHOKIDAR_USEPOLLING=1",
      "CHOKIDAR_INTERVAL=300",
    ],
    Volumes: {
      "/home/codefiddle/code": {},
      "/certs": {},
    },
    HostConfig: hostConfig,
  };

  if (previewEnabled) {
    containerConfig.ExposedPorts = {
      [`${privatePort}/tcp`]: {},
    };
  }

  docker.createContainer(
    containerConfig,
    (err, container) => {
      if (err) {
        console.log(err);
        // ws.send(err);
      } else {
        container.start().then(() => {
          wsForShell.handleUpgrade(req, socket, head, (ws) => {
            wsForShell.emit("connection", ws, req, container);
          });
        });
      }
    }
  );
};

module.exports = handleContainerCreate;
