const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
   
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
   match: [/^\S+@\S+\.\S+$/, "Invalid Email format"],
  },
  password: {
    type: String,
    required: true,
  },
  setPasswordToken: {
    type: String,
  },
  setPasswordExpires: {
    type: String,
  },
});

module.exports = mongoose.model.User || mongoose.model("User", UserSchema);
