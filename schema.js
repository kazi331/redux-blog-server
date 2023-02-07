const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  body: String,
  tags: [{ type: String }],
  date: { type: Date, default: Date.now },
  author: String,
  likes: { type: Number, default: 0 },
  comments: [{ body: String, date: { type: Date, default: Date.now }, author: String }]

})

const Post = mongoose.Model.post || mongoose.model('Post', postSchema)

module.exports = Post