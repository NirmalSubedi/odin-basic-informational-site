import fs from "node:fs/promises";
import http from "node:http";
import { importHtml } from "./importHtml.js";
import { PORT, HTML_DIRECTORY } from "./config.js";

// Listening for requests
const server = http.createServer();

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Handling incoming requests
const getHtmlPage = async ({ req }) => {
  const requestUrl = req.url === "/" ? "/index" : req.url;
  const baseUrl = import.meta.dirname + HTML_DIRECTORY;
  const absoluteUrl = baseUrl + requestUrl + ".html";

  try {
    return await importHtml(await fs.readFile(absoluteUrl));
  } catch (error) {
    error.page = await importHtml(await fs.readFile(baseUrl + "/404.html"));
    throw error;
  }
};

const renderHtml = async (req, res) => {
  res.setHeader("content-type", "text/html; charset=uft-8");

  let page;
  try {
    page = await getHtmlPage({ req });
    res.statusCode = 200;
  } catch (error) {
    if (!error.page) return console.error(error);

    page = error.page;
    res.statusCode = 404;
  } finally {
    res.end(page);
  }
};

server.on("request", renderHtml);

// Logging requests
server.on("request", (req, res) => {
  const startTime = performance.now();

  res.once("finish", () => {
    const responseDuration = `-- ${(performance.now() - startTime).toFixed(2)}ms`;
    console.log(req.method, req.url, res.statusCode, responseDuration);
  });
});
