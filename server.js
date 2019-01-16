const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();
const Scrapper = require("./tools/Scrapper");

app.get("/", (req, res) => {
  res.send("Sanity check");
});

app.get("/scrape", (req, res) => {
  Scrapper.perform().then(results => {
    res.send(results);
  });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
