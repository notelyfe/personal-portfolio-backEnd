const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuoteSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  quote: {
    type: String,
    required: true
  },
  display: {
    type: Boolean,
    required: false
  }
});

module.exports = mongoose.model('quote', QuoteSchema)