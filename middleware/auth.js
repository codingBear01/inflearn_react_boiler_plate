const { User } = require('../models/User');

let auth = (req, res, next) => {
  // 인증 처리 구현
  // client cookie에서 token을 가져온다
  let token = req.cookies.x_auth;
  // token을 복호화한 후 user를 찾는다
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    req.token = token;
    req.user = user;
    next(); // middleware 실행 끝났으면 다음 절차로 넘어감.
  });
  // user 있으면 인증 O 없으면 X
};

module.exports = { auth };
