const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

userSchema.pre('save', function (next) {
  let user = this; // = data in userSchema
  // password가 바뀔 때만 암호화해야 하기 때문에 if문 작성
  if (user.isModified('password')) {
    // 비밀번호를 암호화한다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  }
});

// 위에 작성한 schema를 감쌀 model 생성
const User = mongoose.model('User', userSchema);
// 생성한 schema를 export
module.exports = { User };
