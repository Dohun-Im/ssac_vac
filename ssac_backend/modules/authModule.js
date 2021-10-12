const user = require("../models/user");
const jwtModule = require("./jwtModule");

const authModule = {
  checkVerified: async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(409).json({
        message: "토큰 없음",
      });
    }

    const decoded = jwtModule.verify(token);
    if (decoded === -1) {
      return res.status(409).json({
        message: "만료된 토큰입니다.",
      });
    } else if (decoded === -2) {
      return res.status(409).json({
        message: "유효하지 않은 토큰입니다.",
      });
    } else if (decoded === -3) {
      return res.status(409).json({
        message: "토큰 에러 입니다.",
      });
    }

    let userInfo;
    try {
      userInfo = await user.findOne({ email: decoded.email });
      if (!decoded.verified)
        return res.status(309).json({
          message: "추가 정보를 입력하세요",
        });
      console.log(decoded.verified);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "유효하지 않은 유저입니다.",
      });
    }

    req.userInfo = userInfo;
    //이 함수 결과를 req안에 담고 next로 다음 라우터 순서인 controller로 감
    next();
  },

  loggedIn: async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(409).json({
        message: "토큰 없음",
      });
    }

    const decoded = jwtModule.verify(token);
    if (decoded === -1) {
      return res.status(409).json({
        message: "만료된 토큰입니다.",
      });
    } else if (decoded === -2) {
      return res.status(409).json({
        message: "유효하지 않은 토큰입니다.",
      });
    } else if (decoded === -3) {
      return res.status(409).json({
        message: "토큰 에러 입니다.",
      });
    }

    let userInfo;
    try {
      userInfo = await user.findOne({ email: decoded.email });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "유효하지 않은 유저입니다.",
      });
    }

    req.userInfo = userInfo;
    //이 함수 결과를 req안에 담고 next로 다음 라우터 순서인 controller로 감
    next();
  },

  loggedInTest: async function (req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(409).json({
        message: "토큰 없음",
      });
    }

    const decoded = jwtModule.verify(token);
    if (decoded === -1) {
      return res.status(409).json({
        message: "만료된 토큰입니다.",
      });
    } else if (decoded === -2) {
      return res.status(409).json({
        message: "유효하지 않은 토큰입니다.",
      });
    } else if (decoded === -3) {
      return res.status(409).json({
        message: "토큰 에러 입니다.",
      });
    }
    let userInfo;
    try {
      userInfo = await user.findOne({ email: decoded.email });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "유효하지 않은 유저입니다.",
      });
    }

    req.userInfo = userInfo;
    //이 함수 결과를 req안에 담고 next로 다음 라우터 순서인 controller로 감
    next();
  },
};

module.exports = authModule;
