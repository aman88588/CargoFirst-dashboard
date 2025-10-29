const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Don't return password by default in queries
    },
    role: {
      type: String, 
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: false,
      trim: true,
    },
    memberSince: {
      type: Date,
      default: Date.now, 
    },
  },
  { timestamps: true }
);

const USERSModel = mongoose.model("users", UserSchema);

module.exports = USERSModel;