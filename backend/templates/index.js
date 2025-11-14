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

const withStaticSiteCommands = (label) => ({
  autoBootstrap: true,
  bootstrapDelayMs: 300,
  commands: [
    `echo "Bootstrapping ${label} template: installing dependencies and starting the static preview server..."`,
    `cd ${WORKDIR}`,
    "npm install",
    "npm run dev",
  ],
});

const withNextCommands = (label) => ({
  autoBootstrap: true,
  bootstrapDelayMs: 300,
  commands: [
    `echo "Bootstrapping ${label} template: installing dependencies and starting the Next.js dev server..."`,
    `cd ${WORKDIR}`,
    "export NEXT_TELEMETRY_DISABLED=1",
    "npm install",
    "npm run dev",
  ],
});

const withBunCommands = (label) => ({
  autoBootstrap: true,
  bootstrapDelayMs: 300,
  commands: [
    `echo "Bootstrapping ${label} template: ensuring Bun is available and starting the server..."`,
    `cd ${WORKDIR}`,
    "if [ ! -x \"$HOME/.bun/bin/bun\" ]; then curl -fsSL https://bun.sh/install | bash; fi && export BUN_INSTALL=\"$HOME/.bun\" && export PATH=\"$BUN_INSTALL/bin:$PATH\" && bun install && bun run dev",
  ],
});

const templates = [
  {
    id: "html-css",
    title: "HTML + CSS",
    description: "Barebones static site scaffold with hot reload via serve.",
    category: "frontend",
    tags: ["HTML", "CSS", "Static"],
    directory: path.join(__dirname, "html-css"),
    preview: {
      enabled: true,
      protocol: "http",
      port: 4173,
      healthCheckPath: "/",
      timeoutMs: DEFAULT_TIMEOUT_MS,
      pollIntervalMs: DEFAULT_POLL_INTERVAL_MS,
    },
    shell: withStaticSiteCommands("HTML + CSS"),
    displayOrder: 1,
  },
  {
    id: "react",
    title: "React",
    description: "React 18 powered by Vite with fast refresh.",
    category: "frontend",
    tags: ["React", "Vite", "JavaScript"],
    directory: path.join(__dirname, "react"),
    preview: {
      enabled: true,
      protocol: "http",
      port: 5173,
      healthCheckPath: "/",
      timeoutMs: DEFAULT_TIMEOUT_MS,
      pollIntervalMs: DEFAULT_POLL_INTERVAL_MS,
    },
    shell: withViteCommands("React"),
    displayOrder: 2,
  },
  {
    id: "nextjs",
    title: "Next.js",
    description: "App Router powered Next.js starter with TypeScript.",
    category: "frontend",
    tags: ["Next.js", "React", "TypeScript"],
    directory: path.join(__dirname, "nextjs"),
    preview: {
      enabled: true,
      protocol: "http",
      port: 3000,
      healthCheckPath: "/",
      timeoutMs: 300000,
      pollIntervalMs: DEFAULT_POLL_INTERVAL_MS,
    },
    shell: withNextCommands("Next.js"),
    displayOrder: 3,
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
      protocol: "http",
      port: 5173,
      healthCheckPath: "/",
      timeoutMs: DEFAULT_TIMEOUT_MS,
      pollIntervalMs: DEFAULT_POLL_INTERVAL_MS,
    },
    shell: withViteCommands("Vue"),
    displayOrder: 4,
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
      protocol: "http",
      port: 4200,
      healthCheckPath: "/",
      timeoutMs: 300000,
      pollIntervalMs: 2000,
    },
    shell: withAngularCommands("Angular"),
    displayOrder: 5,
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
      protocol: "http",
      port: 5173,
      healthCheckPath: "/",
      timeoutMs: DEFAULT_TIMEOUT_MS,
      pollIntervalMs: DEFAULT_POLL_INTERVAL_MS,
    },
    shell: withViteCommands("Svelte"),
    displayOrder: 6,
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
      protocol: "http",
      port: 5173,
      healthCheckPath: "/",
      timeoutMs: DEFAULT_TIMEOUT_MS,
      pollIntervalMs: DEFAULT_POLL_INTERVAL_MS,
    },
    shell: withViteCommands("Vanilla JS"),
    displayOrder: 7,
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
      protocol: "http",
      port: 5173,
      healthCheckPath: "/",
      timeoutMs: DEFAULT_TIMEOUT_MS,
      pollIntervalMs: DEFAULT_POLL_INTERVAL_MS,
    },
    shell: withViteCommands("Vanilla TS"),
    displayOrder: 8,
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
    displayOrder: 9,
  },
  {
    id: "bun",
    title: "Bun",
    description: "Bun runtime starter with a zero-dependency HTTP server.",
    category: "backend",
    tags: ["Bun", "JavaScript", "TypeScript"],
    directory: path.join(__dirname, "bun"),
    preview: {
      enabled: true,
      protocol: "http",
      port: 3000,
      healthCheckPath: "/",
      timeoutMs: DEFAULT_TIMEOUT_MS,
      pollIntervalMs: DEFAULT_POLL_INTERVAL_MS,
    },
    shell: withBunCommands("Bun"),
    displayOrder: 10,
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
      protocol: "http",
      port: 3000,
      healthCheckPath: "/",
      timeoutMs: DEFAULT_TIMEOUT_MS,
      pollIntervalMs: DEFAULT_POLL_INTERVAL_MS,
    },
    shell: withNodeCommands("Express"),
    displayOrder: 11,
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
