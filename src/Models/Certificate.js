const mongoose = require('mongoose');
const { Schema } = mongoose;

const CertificateSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  title: {
    type: String,
    required: true
  },
  certificate_image: {
    type: String,
    contentType: String
  },
  issued_by: {
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
  }
});

module.exports = mongoose.model('certificates', CertificateSchema)