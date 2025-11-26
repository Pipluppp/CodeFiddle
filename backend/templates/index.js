const path = require("path");

const WORKDIR = "/home/codefiddle/code";
const DEFAULT_TIMEOUT_MS = Number(process.env.DEV_SERVER_BOOT_TIMEOUT_MS || 180000);
const DEFAULT_POLL_INTERVAL_MS = Number(
  process.env.DEV_SERVER_BOOT_POLL_INTERVAL_MS || 1500
);

const withViteCommands = (label) => ({
  autoBootstrap: true,
  bootstrapDelayMs: 300,
  commands: [
    `echo "Bootstrapping ${label} template: installing dependencies and starting the dev server..."`,
    "export CHOKIDAR_USEPOLLING=1",
    "export CHOKIDAR_INTERVAL=300",
    `cd ${WORKDIR}`,
    "npm install",
    "npm run dev",
  ],
});

const withAngularCommands = (label) => ({
  autoBootstrap: true,
  bootstrapDelayMs: 300,
  commands: [
    `echo "Bootstrapping ${label} template: installing dependencies and starting the Angular dev server..."`,
    "export CHOKIDAR_USEPOLLING=1",
    "export CHOKIDAR_INTERVAL=300",
    `cd ${WORKDIR}`,
    "npm install",
    "npm run dev",
  ],
});

const withNodeCommands = (label) => ({
  autoBootstrap: true,
  bootstrapDelayMs: 300,
  commands: [
    `echo "Bootstrapping ${label} template: installing dependencies and starting the development process..."`,
    `cd ${WORKDIR}`,
    "npm install",
    "npm run dev",
  ],
});

const templates = [
  {
    id: "react",
    title: "React",
    description: "React 18 powered by Vite with fast refresh.",
    category: "frontend",
    tags: ["React", "Vite", "JavaScript"],
    directory: path.join(__dirname, "react"),
    preview: {
      enabled: true,
      protocol: "https",
      port: 5173,
      healthCheckPath: "/",
      timeoutMs: DEFAULT_TIMEOUT_MS,
      pollIntervalMs: DEFAULT_POLL_INTERVAL_MS,
    },
    shell: withViteCommands("React"),
    displayOrder: 1,
  },
  {
    id: "vue",
    title: "Vue",
    description: "Vue 3 Single File Components running on Vite.",
    category: "frontend",
    tags: ["Vue", "Vite", "JavaScript"],
    directory: path.join(__dirname, "vue"),
    preview: {
      enabled: true,
      protocol: "https",
      port: 5173,
      healthCheckPath: "/",
      timeoutMs: DEFAULT_TIMEOUT_MS,
      pollIntervalMs: DEFAULT_POLL_INTERVAL_MS,
    },
    shell: withViteCommands("Vue"),
    displayOrder: 2,
  },
  {
    id: "angular",
    title: "Angular",
    description: "Angular CLI project with standalone components.",
    category: "frontend",
    tags: ["Angular", "CLI", "TypeScript"],
    directory: path.join(__dirname, "angular"),
    preview: {
      enabled: true,
      protocol: "https",
      port: 4200,
      healthCheckPath: "/",
      timeoutMs: 300000,
      pollIntervalMs: 2000,
    },
    shell: withAngularCommands("Angular"),
    displayOrder: 3,
  },
  {
    id: "svelte",
    title: "Svelte",
    description: "Svelte + Vite starter with hot module replacement.",
    category: "frontend",
    tags: ["Svelte", "Vite", "JavaScript"],
    directory: path.join(__dirname, "svelte"),
    preview: {
      enabled: true,
      protocol: "https",
      port: 5173,
      healthCheckPath: "/",
      timeoutMs: DEFAULT_TIMEOUT_MS,
      pollIntervalMs: DEFAULT_POLL_INTERVAL_MS,
    },
    shell: withViteCommands("Svelte"),
    displayOrder: 4,
  },
  {
    id: "javascript",
    title: "Vanilla JS",
    description: "Plain JavaScript project scaffolded with Vite.",
    category: "frontend",
    tags: ["JavaScript", "Vite"],
    directory: path.join(__dirname, "javascript"),
    preview: {
      enabled: true,
      protocol: "https",
      port: 5173,
      healthCheckPath: "/",
      timeoutMs: DEFAULT_TIMEOUT_MS,
      pollIntervalMs: DEFAULT_POLL_INTERVAL_MS,
    },
    shell: withViteCommands("Vanilla JS"),
    displayOrder: 5,
  },
  {
    id: "typescript",
    title: "Vanilla TS",
    description: "TypeScript-first starter powered by Vite.",
    category: "frontend",
    tags: ["TypeScript", "Vite"],
    directory: path.join(__dirname, "typescript"),
    preview: {
      enabled: true,
      protocol: "https",
      port: 5173,
      healthCheckPath: "/",
      timeoutMs: DEFAULT_TIMEOUT_MS,
      pollIntervalMs: DEFAULT_POLL_INTERVAL_MS,
    },
    shell: withViteCommands("Vanilla TS"),
    displayOrder: 6,
  },
  {
    id: "node",
    title: "Node.js",
    description: "Node runtime with an auto-restarting dev script.",
    category: "backend",
    tags: ["Node", "JavaScript"],
    directory: path.join(__dirname, "node"),
    preview: {
      enabled: false,
    },
    shell: withNodeCommands("Node.js"),
    displayOrder: 7,
  },
  {
    id: "express",
    title: "Express",
    description: "Express server with live reload via nodemon.",
    category: "backend",
    tags: ["Express", "API", "Node"],
    directory: path.join(__dirname, "express"),
    preview: {
      enabled: true,
      protocol: "https",
      port: 3000,
      healthCheckPath: "/",
      timeoutMs: DEFAULT_TIMEOUT_MS,
      pollIntervalMs: DEFAULT_POLL_INTERVAL_MS,
    },
    shell: withNodeCommands("Express"),
    displayOrder: 8,
  },
];

const DEFAULT_TEMPLATE_ID = "react";

const getTemplateById = (id) => templates.find((template) => template.id === id);

const getTemplateSummaries = () =>
  templates
    .slice()
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((template) => ({
      id: template.id,
      title: template.title,
      description: template.description,
      category: template.category,
      tags: template.tags,
      hasPreview: Boolean(template.preview?.enabled),
    }));

module.exports = {
  DEFAULT_TEMPLATE_ID,
  templates,
  getTemplateById,
  getTemplateSummaries,
};
