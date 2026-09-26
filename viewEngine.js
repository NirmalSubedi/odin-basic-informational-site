import fs from "node:fs/promises";
import { importHtml } from "./views/partials/importHtml.js";

export const viewEngine = async (filePath, options, callback) => {
  try {
    const content = await fs.readFile(filePath, "utf8");
    const html = await importHtml(content);
    return callback(null, html);
  } catch (error) {
    console.error(error);
    callback(error);
  }
};
