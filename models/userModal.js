const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    roles: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Role"
        }
      ],
    verification: Boolean
  })
);

module.exports = User;