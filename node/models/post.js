var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// a stackoverflow-style post with a title, some detail text,
// and metadata regarding the author and date of creation.
var PostSchema = new Schema({
  title: String,
  description: String,
  author: String,
  dateCreated: Date,
  dateEdited: Date,
  favoriteCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
});

module.exports = mongoose.model('Post', PostSchema);
