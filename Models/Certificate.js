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
  certificate_link: {
    type: String,
    required: true
  },
  issued_by: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('certificates', CertificateSchema)