import fs from "node:fs/promises";
import http from "node:http";

// Listening for requests
const PORT = 8080;
const server = http.createServer();

server.listen(PORT, "localhost", () => {
  console.log(`Listening on port ${PORT}`);
});

// Handling incoming requests
const getHtmlPage = async ({ req }) => {
  const HTML_DIRECTORY = "./views";
  const requestUrl = req.url === "/" ? "/index" : req.url;
  const relativeUrl = HTML_DIRECTORY + requestUrl + ".html";

  try {
    return await fs.readFile(relativeUrl);
  } catch (error) {
    error.page = await fs.readFile(HTML_DIRECTORY + "/404.html");
    throw error;
  }
};

const renderHtml = async (req, res) => {
  let page;
  try {
    res.setHeader("content-type", "text/html; charset=uft-8");
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
