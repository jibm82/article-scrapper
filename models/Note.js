const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  article: { type: Schema.Types.ObjectId, ref: "Article" },
  body: {
    type: String,
    unique: true,
    required: true
  }
});

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
