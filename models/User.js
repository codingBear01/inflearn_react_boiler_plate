const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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
  } else {
    next();
  }
});

// 암호화되지 않은 plainPassword를 암호화하여와 DB내의 this.password 일치 여부 check
userSchema.methods.comparePassword = function (plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatched) {
    if (err) return callback(err);
    callback(null, isMatched);
  });
};
// jsonwebtoken package를 활용해 user token 생성
userSchema.methods.generateToken = function (callback) {
  let user = this;

  const token = jwt.sign(user._id.toHexString(), 'secretToken');

  user.token = token;
  user.save(function (err, user) {
    if (err) return callback(err);
    callback(null, user);
  });
};

userSchema.statics.findByToken = function (token, callback) {
  let user = this;

  // 토큰을 decode한다
  jwt.verify(token, 'secretToken', function (err, decoded) {
    // user._id를 이용해서 유저를 찾은 다음에
    // clien에서 가져온 token과 DB에 보관된 토큰 일치 여부 check
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return callback(err);
      callback(null, user);
    });
  });
};

// 위에 작성한 schema를 감쌀 model 생성
const User = mongoose.model('User', userSchema);
// 생성한 schema를 export
module.exports = { User };
