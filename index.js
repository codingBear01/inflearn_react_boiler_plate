// express 불러오기
const express = require('express');
const app = express();
const port = 5000;
// json 형식 data parse 위한 body-parser
const bodyParser = require('body-parser');
// cookie에다 user token을 save 하기 위해 cookie-parser input
const cookieParser = require('cookie-parser');
const { auth } = require('./middleware/auth');
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
app.use(cookieParser());

// Mongoose 활용하여 MongoDB와 연결
const mongoose = require('mongoose');
mongoose
  .connect(config.mongoURI)
  .then(() => console.log('MongoDB Conected...'))
  .catch((e) => console.log('MongoDB error: ', e));

app.get('/', (req, res) => res.send('Hello, World'));

// Register
app.post('/api/users/register', (req, res) => {
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

// Log in
app.post('/api/users/login', (req, res) => {
  // 요청된 이메일을 DB에서 찾기
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: '입력한 이메일에 해당하는 유저가 없습니다.',
      });
    }

    //  if true -> 비밀번호 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatched) => {
      if (!isMatched)
        return res.json({
          loginSuccess: false,
          message: 'Your password is wrong',
        });
      //    if true -> user를 위한 token 생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        res // 생성된 user token을 cookie에 저장
          .cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.get('/api/users/auth', auth, (req, res) => {
  // auth 전부 통과하면 아래 기능 실행
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
