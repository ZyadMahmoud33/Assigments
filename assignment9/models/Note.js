const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          const hasLetters = /[a-zA-Z]/.test(value);
          if (!hasLetters) return true; // nothing to check if there are no letters
          return value !== value.toUpperCase();
        },
        message: (props) => `"${props.value}" must not be entirely uppercase`,
      },
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

module.exports = mongoose.model("Note", noteSchema);
