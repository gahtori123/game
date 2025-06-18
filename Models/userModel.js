const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    profilepic: {
      type: String,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    history: {
      type: Array,
      default: [],
    },

    Requests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Req",
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password;
  this.password = await bcrypt.hash(this.password, salt);
});
module.exports = mongoose.model("User", userSchema);
