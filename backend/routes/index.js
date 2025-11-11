const express = require("express");
const router = express.Router();

const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");
const directoryTree = require("directory-tree");

const createPlaygroundFromTemplate = require("../utils/createPlaygroundFromTemplate");
const {
  DEFAULT_TEMPLATE_ID,
  getTemplateSummaries,
  getTemplateById,
} = require("../templates");

router
  .get("/", async (req, res) => {
    const templateId = req.query.template || DEFAULT_TEMPLATE_ID;

    try {
      const { playgroundId, template } = await createPlaygroundFromTemplate(
        templateId
      );

      res.json({
        playgroundId,
        template: template.id,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to create playground" });
    }
  })
  .post("/playgrounds", async (req, res) => {
    const templateId = req.body?.template || DEFAULT_TEMPLATE_ID;

    const template = getTemplateById(templateId);
    if (!template) {
      return res.status(400).json({ error: "Unknown template specified" });
    }

    try {
      const { playgroundId } = await createPlaygroundFromTemplate(templateId);

      res.status(201).json({
        playgroundId,
        template: templateId,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to create playground" });
    }
  })
  .get("/playgrounds/:playgroundId/meta", async (req, res) => {
    const playgroundId = req.params.playgroundId;
    const metadataPath = path.resolve(
      `${__dirname}/../playgrounds/${playgroundId}/template.json`
    );

    try {
      const rawMetadata = await fsPromises.readFile(metadataPath, "utf-8");
      const metadata = JSON.parse(rawMetadata);
      const template = metadata?.template
        ? getTemplateById(metadata.template)
        : null;

      res.json({
        templateId: metadata?.template ?? null,
        title: template?.title ?? null,
        hasPreview: Boolean(template?.preview?.enabled),
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({ error: "Metadata for playground not found." });
    }
  })
  .get("/templates", (req, res) => {
    res.json({ templates: getTemplateSummaries() });
  })
  .get("/tree/:playgroundId", (req, res) => {
    const playgroundId = req.params.playgroundId;
    const playGroundPath = path.resolve(
      `${__dirname}/../playgrounds/${playgroundId}/code`
    );
    const tree = directoryTree(playGroundPath);
    res.json(tree);
  });

module.exports = router;
