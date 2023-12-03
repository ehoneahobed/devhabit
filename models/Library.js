const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  type: {
    type: String, // e.g., 'Video', 'Article', 'Book', 'Documentation'
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        const re = /^(http|https):\/\/[^ "]+$/;
        return re.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  description: {
    type: String,
    trim: true
  }
});

const librarySchema = new mongoose.Schema({
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Goal'
  },
  resources: [resourceSchema]
}, { timestamps: true });

const Library = mongoose.model('Library', librarySchema);

module.exports = Library;
