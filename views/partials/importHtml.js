import fs from "node:fs/promises";

// replace referenced html file with its content
export const importHtml = async (html) => {
  const partialsPath = /<@\s*([\w/.]+)\s*@>/g;
  const paths = html.matchAll(partialsPath);

  await Promise.all(
    paths.map(async (path) => {
      const [refTag, referencedFile] = path;
      const partialFileUrl = new URL(`./${referencedFile}`, import.meta.url);

      try {
        const partialContent = await fs.readFile(partialFileUrl, "utf8");
        html = html.replace(refTag, partialContent);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }),
  );

  return html;
};
