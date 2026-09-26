import express from "express";
import * as controller from "./controllers/controller.js";
import { viewEngine } from "./viewEngine.js";

const app = express();
const PORT = 8080;

// Listening for requests
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server running on PORT: ${PORT}`);
});

// Settings
app.set("x-powered-by", false);
app.set("view engine", "html");
app.engine("html", viewEngine);

// Logging to console
app.use(controller.createRequestLogger());

// Handling incoming requests
app.get(["/", "/index"], controller.index__get);
app.get("/about", controller.about__get);
app.get("/contact-me", controller.contact_me__get);
app.use(controller.page_not_found);

// Error handling
app.use(controller.server_error);
