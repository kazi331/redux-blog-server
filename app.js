const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const Post = require('./schema');

const app = express();
// middlewares
app.use(express.json())
require('dotenv').config()
app.use(cors())

// entry
app.get('/', (req, res) => {
  res.send('entry')
})

// mongdodb connection
try {

  const uri = process.env.MONGO_URI;
  mongoose.set('strictQuery', false)
  mongoose.connect(uri, { dbName: 'redux' })
    .then(console.log('DB connected'))
    .catch(err => console.log(err))

} catch (err) {
  console.log('err', err);
  res.status(500).json({ success: false, message: 'db connection failed', error: err })
}



// create post
app.post('/post', async (req, res) => {
  const post = new Post(req.body)
  await post.save((err, data) => {
    if (err) {
      console.log(err)
      res.status(500).json({ success: false, message: 'post not created', error: err })
    }
    if (data) {
      res.status(201).json({ success: true, message: 'post created', post: data })
    }
  });

})


// get all post
app.get('/posts', async (req, res) => {
  const data = await Post.find();
  res.status(200).json({ success: true, posts: data })
})

// get single post
app.get('/post/:id', async (req, res) => {
  const id = req.params.id;
  const item = await Post.findById(id);
  console.log(item);
  if (item === null) {
    res.status(404).json({ success: false, message: 'no post found' })
  }
  if (item) {
    res.status(200).send(item);
  }
})

// delete post with id
app.delete('/post/:id', async (req, res) => {
  const id = req.params.id;
  const item = await Post.findByIdAndDelete(id);
  if (item === null) {
    res.status(404).json({ success: false, message: 'no post found' })
  }
  if (item) {
    res.status(200).json({ success: true, message: 'post deleted' })
  }
})

// update post with id
app.put('/post/:id', async (req, res) => {
  const id = req.params.id;

  const result = await Post.updateOne({ _id: id }, req.body)
  if (result.modifiedCount) {
    res.status(200).json({ success: true, message: 'post updated' })
  } else {
    res.status(500).json({ success: false, message: 'post not updated' })
  }

})



app.listen(5000, () => console.log('http://localhost:5000'))
