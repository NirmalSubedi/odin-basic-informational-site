import fs from "node:fs/promises";
import { importHtml } from "./views/partials/importHtml.js";

(async () => {
  const files = await fs.readdir("./views");
  await fs.mkdir("./dist", { recursive: true });
  files
    .filter((file) => file.includes(".html"))
    .forEach(async (file) => {
      const content = await importHtml(
        await fs.readFile(`./views/${file}`, "utf8"),
      );
      await fs.writeFile(`./dist/${file}`, content);
    });
})();
