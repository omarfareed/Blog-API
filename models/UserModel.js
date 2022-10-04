const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const validator = require("../utils/validator");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: "invalid email",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.post("save", async function (doc, next) {
  doc.password = undefined;
  next();
});
userSchema.methods.correctPassword = async (userPass, hashPass) =>
  await bcrypt.compare(userPass, hashPass);
module.exports = mongoose.model("User", userSchema);
