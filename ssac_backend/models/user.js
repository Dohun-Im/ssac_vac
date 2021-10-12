const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// import dayjs from "dayjs";

// const formatDate = dayjs(new Date()).format("YYYY-MM-DD");

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  nickName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: {
    type: String,
    enum: ["모더나", "화이자", "AZ", "얀센", null],
    default: null,
  },
  bDay: { type: Date, default: null },
  gender: { type: Number, enum: [0, 1, 2, null], default: null },
  degree: { type: Number, default: null },
  inoDate1: { type: Date, default: null },
  inoDate2: { type: Date, default: null },
  profileImage: { type: String, default: null },

  signupDate: { type: Date, default: new Date() },
  updateDate: { type: Date, default: null },

  verified: { type: Boolean, default: false },
});

const bcrypt = require("bcrypt");
const saltRounds = 10; //클수록 암호화 오래걸림

userSchema.pre("save", function (next) {
  let user = this; //this 는 suerSchema

  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err); //next 시 user.save(로 바로 넘어감)
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next(); //user.save()실행
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    } else {
      cb(null, isMatch);
    }
  });
};

module.exports = mongoose.model("user", userSchema);
