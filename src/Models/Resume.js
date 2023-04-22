const mongoose = require('mongoose');
const { Schema } = mongoose;

const ResumeSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  resume_file: {
    type: String,
  },
  posted_On: {
    type: Date
  },
  updated_On: {
    type: Date
  },
  resume_key: {
    type: String
  }
});

module.exports = mongoose.model('resume', ResumeSchema)