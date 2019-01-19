const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  author: {
    type: String
  },
  author_url: {
    type: String
  },
  image: {
    type: String,
    required: true
  },
  publish_date: {
    type: Date,
    get: value => value.toDateString()
  },
  summary: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    unique: true,
    required: true
  },
  favorite: {
    type: Boolean,
    default: false
  },
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note"
    }
  ]
});

const Article = mongoose.model("Article", ArticleSchema);

ArticleSchema.plugin(uniqueValidator);

module.exports = Article;
