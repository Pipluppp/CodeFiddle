const fs = require("fs");
const path = require("path");

const {
  DEFAULT_TEMPLATE_ID,
  getTemplateById,
} = require("../templates");

const TEMPLATE_METADATA_FILE = "template.json";

const loadTemplateMetadata = (playgroundId) => {
  const metadataPath = path.resolve(
    __dirname,
    "../playgrounds",
    playgroundId,
    TEMPLATE_METADATA_FILE
  );

  if (!fs.existsSync(metadataPath)) {
    return null;
  }

  try {
    const metadataRaw = fs.readFileSync(metadataPath, "utf-8");
    return JSON.parse(metadataRaw);
  } catch (error) {
    console.error(`Failed to read template metadata for ${playgroundId}`, error);
    return null;
  }
};

const getTemplateForPlayground = (playgroundId) => {
  const metadata = loadTemplateMetadata(playgroundId);

  if (!metadata || !metadata.template) {
    return getTemplateById(DEFAULT_TEMPLATE_ID);
  }

  return getTemplateById(metadata.template) || getTemplateById(DEFAULT_TEMPLATE_ID);
};

module.exports = getTemplateForPlayground;
