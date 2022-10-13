const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProjectSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  project_link:{
    type: string,
    required: true
  },
  code_link:{
    type: string,
    required: true
  }
});

module.exports = mongoose.model('projects', ProjectSchema)