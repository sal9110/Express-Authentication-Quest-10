const { setupRoutes } = require("./routes");
const express = require("express");
const app = express();

const port = process.env.PORT || 3003;

app.use(express.json());

setupRoutes(app);

app.listen(3003, () => {
  console.log(`Server listening on port ${port}`);
});
