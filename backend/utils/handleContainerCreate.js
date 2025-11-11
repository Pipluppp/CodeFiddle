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
    ],
  };

  if (previewEnabled) {
    hostConfig.PortBindings = {
      [`${privatePort}/tcp`]: [{ HostPort: "0" }],
    };
  }

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
    Volumes: {
      "/home/codefiddle/code": {},
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
