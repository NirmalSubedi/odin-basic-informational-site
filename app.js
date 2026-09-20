import http from "node:http";

const PORT = 8080;

const logRequest = ({ req, res, startTime }) => {
  const responseDuration = `-- ${(performance.now() - startTime).toFixed(2)}ms`;

  console.log(req.method, req.url, res.statusCode, responseDuration);
};

const server = http.createServer((req, res) => {
  const startTime = performance.now();

  res.statusCode = 200;
  res.setHeader("content-type", "text/plain");
  res.end("hello world");

  res.on("finish", () => {
    logRequest({ req, res, startTime });
  });
});

server.listen(PORT, "localhost", () => {
  console.log(`Listening on port ${PORT}`);
});
