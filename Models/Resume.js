const mongoose = require('mongoose');
const { Schema } = mongoose;

const ResumeSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  resume_link: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('resume', ResumeSchema)