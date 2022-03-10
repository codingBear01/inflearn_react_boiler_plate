const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0, // 0이면 일반 user, 1이면 관리자
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    // 토큰 유효기간
    type: Number,
  },
});

const User = mongoose.model('User', userSchema); // 위에 작성한 schema를 감쌀 model 생성

module.exports = { User }; // 생성한 schema를 export
