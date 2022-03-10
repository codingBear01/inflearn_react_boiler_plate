// express 불러오기
const express = require('express');
const app = express();
const port = 5000;
// Mongoose 활용하여 MongoDB와 연결
const mongoose = require('mongoose');
mongoose
  .connect(
    'mongodb+srv://kang:audwkwkd@cluster0.t8kkn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
  )
  .then(() => console.log('MongoDB Conected...'))
  .catch((e) => console.log('MongoDB error: ', e));

app.get('/', (req, res) => res.send('Hello, World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

//
