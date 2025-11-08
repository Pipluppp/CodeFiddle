const fs = require("fs");
const http = require("http");

const Docker = require("dockerode");

const docker = new Docker();

const DEV_SERVER_PRIVATE_PORT = 5173;
const DEV_SERVER_TIMEOUT_MS = Number(
  process.env.DEV_SERVER_BOOT_TIMEOUT_MS || 180000
);
const DEV_SERVER_POLL_INTERVAL_MS = Number(
  process.env.DEV_SERVER_BOOT_POLL_INTERVAL_MS || 1500
);
const CONTAINER_HOST = process.env.CONTAINER_HOST || "127.0.0.1";

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const isServerReachable = (host, port) =>
  new Promise((resolve) => {
    const request = http.get(
      {
        host,
        port,
        path: "/",
        timeout: 2000,
      },
      (response) => {
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

const waitForDevServer = async (host, port) => {
  const deadline = Date.now() + DEV_SERVER_TIMEOUT_MS;

  while (Date.now() < deadline) {
    const reachable = await isServerReachable(host, port);
    if (reachable) {
      return;
    }
    await sleep(DEV_SERVER_POLL_INTERVAL_MS);
  }

  throw new Error(`Timed out waiting for dev server on ${host}:${port}`);
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
      const name = data;

      if (!name) {
        const errMessage = {
          type: "devServerError",
          payload: {
            message: "Missing container name while registering port.",
          },
        };
        ws.send(JSON.stringify(errMessage));
        break;
      }

      docker.listContainers({ name: name }, async (err, containers) => {
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
            port.PrivatePort === DEV_SERVER_PRIVATE_PORT && port.Type === "tcp"
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
          await waitForDevServer(CONTAINER_HOST, publicPort);
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
                "Timed out while waiting for the preview server. Check the terminal output for details.",
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
