export const index__get = async (req, res) => res.render("index");
export const about__get = async (req, res) => res.render("about");
export const contact_me__get = async (req, res) => res.render("contact-me");

export const page_not_found = async (req, res) => {
  req.url = "/404";
  res.status(404).render("404");
};

export const server_error = async (err, req, res, next) => {
  if (res.headersSent) return next(err);
  console.error(err);

  req.url = "/500";
  res.status(500).render("500");
};

export const createRequestLogger = () => {
  return (req, res, next) => {
    const startTime = performance.now();
    next();

    res.once("finish", () => {
      const responseDuration = `-- ${(performance.now() - startTime).toFixed(2)}ms`;
      console.log(
        req.method,
        req.originalUrl,
        res.statusCode,
        responseDuration,
      );
    });
  };
};
