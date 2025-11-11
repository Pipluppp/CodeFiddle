const fs = require("fs/promises");
const path = require("path");

const copyDirectory = async (source, destination) => {
  const entries = await fs.readdir(source, { withFileTypes: true });
  await fs.mkdir(destination, { recursive: true });

  for (const entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
      continue;
    }

    if (entry.isSymbolicLink()) {
      const symbolicLink = await fs.readlink(srcPath);
      await fs.symlink(symbolicLink, destPath);
      continue;
    }

    await fs.copyFile(srcPath, destPath);
  }
};

module.exports = copyDirectory;
