// express 불러오기
const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
// user 정보 호출에 필요한 userSchma input
const { User } = require('./models/User');
// local or remote 환경 여부에 따라 mongoURI 호출하기 위한 key.js input
const config = require('./config/key');

/*
body-parser 설정
각각 application/x-www-form-urlencoded, application/json 형식 data parase하여 호출
*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Mongoose 활용하여 MongoDB와 연결
const mongoose = require('mongoose');
mongoose
  .connect(config.mongoURI)
  .then(() => console.log('MongoDB Conected...'))
  .catch((e) => console.log('MongoDB error: ', e));

app.get('/', (req, res) => res.send('Hello, World'));

app.post('/register', (req, res) => {
  // 회원 가입 시 필요 정보를 client에서 호출하여 DB에 save
  const user = new User(req.body);
  // body-parser를 통해 json 형식으로 parse한 data body에 save
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
