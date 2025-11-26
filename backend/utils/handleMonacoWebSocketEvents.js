const fs = require("fs");
const http = require("http");
const https = require("https");

const Docker = require("dockerode");

const getTemplateForPlayground = require("./getTemplateForPlayground");

const docker = new Docker();

const DEFAULT_DEV_SERVER_TIMEOUT_MS = Number(
  process.env.DEV_SERVER_BOOT_TIMEOUT_MS || 180000
);
const DEFAULT_DEV_SERVER_POLL_INTERVAL_MS = Number(
  process.env.DEV_SERVER_BOOT_POLL_INTERVAL_MS || 1500
);
const CONTAINER_HOST = process.env.CONTAINER_HOST || "127.0.0.1";

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const isServerReachable = (host, port, path = "/", protocol = "http") =>
  new Promise((resolve) => {
    const lib = protocol === "https" ? https : http;

    const options = {
      host,
      port,
      path,
      timeout: 2000,
      // If using HTTPS, don't fail because 'localhost' doesn't match 'codebox.tutorialsdojo.com'
      rejectUnauthorized: false,
    };

    const request = lib.get(options, (response) => {
        response.resume();
        resolve(response.statusCode < 500);
      }
    );

    request.on("error", () => resolve(false));
    request.on("timeout", () => {
      request.destroy();
      resolve(false);
    });
  });

const waitForDevServer = async (
  host,
  port,
  path,
  protocol = "http",
  timeoutMs = DEFAULT_DEV_SERVER_TIMEOUT_MS,
  pollIntervalMs = DEFAULT_DEV_SERVER_POLL_INTERVAL_MS
) => {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const reachable = await isServerReachable(host, port, path, protocol);
    if (reachable) {
      return;
    }
    await sleep(pollIntervalMs);
  }

  throw new Error(`Timed out waiting for dev server on ${protocol}://${host}:${port}`);
};

const handleMonacoWebSocketEvents = (ws, type, data, pathToFileOrFolder) => {
  switch (type) {
    case "writeFile":
      fs.writeFile(pathToFileOrFolder, data, (err) => {
        if (err) {
          console.log(err);
          const errMessage = {
            type: "error",
            payload: {
              data: "Could not write to file",
            },
          };
          ws.send(JSON.stringify(errMessage));
        } else {
          const successMessage = {
            type: "writeFile",
            payload: {
              data: "File written successfully",
            },
          };
          ws.send(JSON.stringify(successMessage));
        }
      });
      break;
    case "createFile":
      if (fs.existsSync(pathToFileOrFolder)) {
        const errMessage = {
          type: "error",
          payload: {
            data: "File already exists",
          },
        };
        ws.send(JSON.stringify(errMessage));
      } else {
        fs.writeFile(pathToFileOrFolder, "", (err) => {
          if (err) {
            console.log(err);
            const errMessage = {
              type: "error",
              payload: {
                data: "Could not create file",
              },
            };
            ws.send(JSON.stringify(errMessage));
          } else {
            ws.send("success");
          }
        });
      }
      break;
    case "readFile":
      fs.readFile(pathToFileOrFolder, (err, data) => {
        if (err) {
          console.log(err);
          const errMessage = {
            type: "error",
            payload: {
              data: "Could not read file",
            },
          };
          ws.send(JSON.stringify(errMessage));
        } else {
          const successMessage = {
            type: "readFile",
            payload: {
              data: data.toString(),
              path: pathToFileOrFolder,
            },
          };
          ws.send(JSON.stringify(successMessage));
        }
      });
      break;
    case "deleteFile":
      fs.unlink(pathToFileOrFolder, (err) => {
        if (err) {
          console.log(err);
          const errMessage = {
            type: "error",
            payload: {
              data: "Could not delete file",
            },
          };
          ws.send(JSON.stringify(errMessage));
        } else {
          ws.send("success");
        }
      });
      break;
    case "createFolder":
      fs.mkdir(pathToFileOrFolder, (err) => {
        if (err) {
          console.log(err);
          const errMessage = {
            type: "error",
            payload: {
              data: "Could not create folder",
            },
          };
          ws.send(JSON.stringify(errMessage));
        } else {
          ws.send("success");
        }
      });
      break;
    case "deleteFolder":
      fs.rmdir(pathToFileOrFolder, { recursive: true }, (err) => {
        if (err) {
          console.log(err);
          const errMessage = {
            type: "error",
            payload: {
              data: "Could not delete folder",
            },
          };
          ws.send(JSON.stringify(errMessage));
        } else {
          ws.send("success");
        }
      });
      break;
    case "registerPort": {
      const playgroundId = data;

      if (!playgroundId) {
        const errMessage = {
          type: "devServerError",
          payload: {
            message: "Missing container name while registering port.",
          },
        };
        ws.send(JSON.stringify(errMessage));
        break;
      }

      const template = getTemplateForPlayground(playgroundId);
      const previewConfig = template?.preview || {};

      if (!previewConfig.enabled || !previewConfig.port) {
        const errMessage = {
          type: "devServerError",
          payload: {
            message:
              `${template?.title || "Selected"} template does not expose a browser preview. Use the console to interact with your project.`,
          },
        };
        ws.send(JSON.stringify(errMessage));
        break;
      }

      const privatePort = previewConfig.port;
      const healthCheckPath = previewConfig.healthCheckPath || "/";
      const protocol = previewConfig.protocol || "http";
      const timeoutMs =
        previewConfig.timeoutMs || DEFAULT_DEV_SERVER_TIMEOUT_MS;
      const pollIntervalMs =
        previewConfig.pollIntervalMs || DEFAULT_DEV_SERVER_POLL_INTERVAL_MS;

      docker.listContainers({ name: playgroundId }, async (err, containers) => {
        if (err) {
          console.log(err);
          const errMessage = {
            type: "devServerError",
            payload: {
              message: "Failed to locate container for preview. Check the terminal for errors.",
            },
          };
          ws.send(JSON.stringify(errMessage));
          return;
        }

        if (!containers || containers.length === 0) {
          const errMessage = {
            type: "devServerError",
            payload: {
              message: "Preview container not found. Please retry creating the playground.",
            },
          };
          ws.send(JSON.stringify(errMessage));
          return;
        }

        const containerDetails = containers[0];
        const portDetails = containerDetails.Ports.find(
          (port) =>
            port.PrivatePort === privatePort && port.Type === "tcp"
        ) || containerDetails.Ports.find((port) => port.PublicPort);

        if (!portDetails || !portDetails.PublicPort) {
          const errMessage = {
            type: "devServerError",
            payload: {
              message: "No exposed port found for the preview server.",
            },
          };
          ws.send(JSON.stringify(errMessage));
          return;
        }

        const publicPort = portDetails.PublicPort;

        try {
          await waitForDevServer(
            CONTAINER_HOST,
            publicPort,
            healthCheckPath,
            protocol,
            timeoutMs,
            pollIntervalMs
          );
          const successMessage = {
            type: "registerPort",
            payload: {
              port: publicPort,
            },
          };
          ws.send(JSON.stringify(successMessage));
        } catch (error) {
          console.log(error);
          const errMessage = {
            type: "devServerError",
            payload: {
              message:
                `Timed out while waiting for the ${template?.title || "project"} preview server. Check the terminal output for details.`,
            },
          };
          ws.send(JSON.stringify(errMessage));
        }
      });
      break;
    }

    default:
      console.log("Invalid type ", type);
      const errMessage = {
        type: "error",
        payload: {
          data: "Invalid type",
        },
      };
      ws.send(JSON.stringify(errMessage));
      break;
  }
};

module.exports = handleMonacoWebSocketEvents;
