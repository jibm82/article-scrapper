const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();
const exphbs = require("express-handlebars");
const Scrapper = require("./tools/Scrapper");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  Scrapper.perform().then(articles => {
    res.render("index", { articles });
  });
});

app.get("/scrape", (req, res) => {
  Scrapper.perform().then(results => {
    res.send(results);
  });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
