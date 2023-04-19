const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
      },
      user_id:{
        type: String,
        required: true,
        unique: true
      },
      password:{
        type: String,
        required: true
      },
      user_type:{
        type: String,
        required: true
      }
});

module.exports = mongoose.model('user', UserSchema)