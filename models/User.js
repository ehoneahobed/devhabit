const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
          return re.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    fullname: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    tokens: [
      {
        token: {
          type: String,
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

// Password hashing middleware.
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// Helper method to check password.
userSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
