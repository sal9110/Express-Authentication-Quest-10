const moviesRouter = require("./movies");
const usersRouter = require("./users");
const checkCredentialRouter = require("./checkCredential");

const setupRoutes = (app) => {
  // Movie routes
  app.use("/api/movies", moviesRouter);
  // User routes
  // TODO
  app.use("/api/users", usersRouter);

  app.use("/api/auth/checkCredentials", checkCredentialRouter);
};

module.exports = {
  setupRoutes,
};
