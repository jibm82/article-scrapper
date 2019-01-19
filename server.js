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
    .then(articles => res.render("index", { articles, home: true }))
    .catch(err => {
      console.log(err);
      res.render("index", { articles: [] });
    });
});

app.get("/favorites", (req, res) => {
  db.Article.find({ favorite: true })
    .then(articles => res.render("index", { articles, home: false }))
    .catch(err => {
      console.log(err);
      res.render("index", { articles: [] });
    });
});

app.get("/scrappe", (req, res) => {
  Scrapper.perform()
    .then(articles => res.json({ articles: articles }))
    .catch(err => {
      console.log(err);
      res.json({ error: err });
    });
});

app.post("/api/articles/favourite", (req, res) => {
  db.Article.updateOne({ _id: req.body.id }, { $set: { favorite: true } })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.json(err);
    });
});

app.post("/api/articles/unfavourite", (req, res) => {
  db.Article.updateOne({ _id: req.body.id }, { $set: { favorite: false } })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.json({ error: err.message });
    });
});

app.post("/api/articles/:id/notes", (req, res) => {
  db.Article.findOne({ _id: req.params.id })
    .then(article => {
      if (!article) {
        res.status(404).json({ error: "Article not found" });
      }

      db.Note.create({ article: article.id, content: req.body.content })
        .then(note => {
          res.json(note);
        })
        .catch(err => {
          res.status(422).json({ error: err.message });
        });
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

app.delete("/api/notes/:id", (req, res) => {
  db.Note.findOneAndRemove({ _id: req.params.id })
    .then(note => {
      if (!note) {
        res.status(404).json({ error: "Note not found" });
      }
      res.json(note);
    })
    .catch(err => {
      res.status(400).json({ error: err.message });
    });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
