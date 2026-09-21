import fs from "node:fs/promises";
import { HTML_DIRECTORY, PARTIALS_DIRECTORY } from "./config.js";

// replace referenced html file with its content
export const importHtml = async (html) => {
  let str = html.toString();
  const partialsPath = /<@\s*([\w/.]+)\s*@>/g;
  const paths = str.matchAll(partialsPath);

  await Promise.all(
    paths.map(async (path) => {
      const [refTag, relativePath] = path;
      const absolutePath = `${import.meta.dirname}${HTML_DIRECTORY}${PARTIALS_DIRECTORY}${relativePath}`;

      try {
        const partialContent = await fs.readFile(absolutePath, "utf8");
        str = str.replace(refTag, partialContent);
      } catch (error) {
        console.error(error);
      }
    }),
  );

  return str;
};
