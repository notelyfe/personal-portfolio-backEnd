const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProjectSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  project_link: {
    type: String,
    required: true
  },
  website_link: {
    type: String,
    required: true
  },
  project_image: {
    type: String,
    contentType: String
  }
});

module.exports = mongoose.model('projects', ProjectSchema)