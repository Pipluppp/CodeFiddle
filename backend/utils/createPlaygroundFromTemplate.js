const fs = require("fs/promises");
const path = require("path");
const uuid4 = require("uuid4");

const copyDirectory = require("./copyDirectory");
const {
  DEFAULT_TEMPLATE_ID,
  getTemplateById,
} = require("../templates");

const PLAYGROUNDS_ROOT = path.resolve(__dirname, "../playgrounds");
const TEMPLATE_METADATA_FILE = "template.json";

const resolveTemplate = (templateId) => {
  if (!templateId) {
    return getTemplateById(DEFAULT_TEMPLATE_ID);
  }

  return getTemplateById(templateId) || getTemplateById(DEFAULT_TEMPLATE_ID);
};

const createPlaygroundFromTemplate = async (templateId) => {
  const template = resolveTemplate(templateId);

  if (!template) {
    throw new Error("Failed to resolve a template for playground creation.");
  }

  const playgroundId = uuid4();
  const playgroundRoot = path.join(PLAYGROUNDS_ROOT, playgroundId);
  const codeDirectory = path.join(playgroundRoot, "code");

  await fs.mkdir(playgroundRoot, { recursive: true });
  await copyDirectory(template.directory, codeDirectory);

  const metadata = {
    template: template.id,
    createdAt: new Date().toISOString(),
  };

  await fs.writeFile(
    path.join(playgroundRoot, TEMPLATE_METADATA_FILE),
    JSON.stringify(metadata, null, 2),
    "utf-8"
  );

  return {
    playgroundId,
    template,
  };
};

module.exports = createPlaygroundFromTemplate;
