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
  isActive: {
    type: Boolean,
    default: true
  },
  created_On: {
    type: Date
  },
  updated_On: {
    type: Date
  },
  project_image: {
    type: String,
    required: true
  },
  project_key: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('projects', ProjectSchema)