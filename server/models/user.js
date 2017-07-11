var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  id: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  messages: {
    type: [],
    default: []
  }
});

module.exports = mongoose.model('User', userSchema);
