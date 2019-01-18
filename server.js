const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const db = require("./models");
const Scrapper = require("./tools/Scrapper");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(
  "mongodb://localhost/unit18Populater",
  { useNewUrlParser: true }
);

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  db.Article.find({})
    .then(articles => res.render("index", { articles }))
    .catch(err => {
      console.log(err);
      res.render("index", { articles: [] });
    });
});

app.get("/favorites", (req, res) => {
  db.Article.find({ favorite: true })
    .then(articles => res.render("index", { articles }))
    .catch(err => {
      console.log(err);
      res.render("index", { articles: [] });
    });
});

app.get("/scrape", (req, res) => {
  Scrapper.perform()
    .then(articles => res.json({ articles: articles }))
    .catch(err => {
      console.log(err);
      res.json({ error: err });
    });
});

app.post("/api/articles/favourite", (req, res) => {
  res.json(req.body.id);
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
