const mongoose = require('mongoose');
const { Schema } = mongoose;

const ResumeSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  resume_file: {
    data: Buffer,
    contentType: String
  }
});

module.exports = mongoose.model('resume', ResumeSchema)