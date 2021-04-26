const mongoose = require('mongoose');
const { Schema } = mongoose;

const issueSchema = new Schema({
  name:  String,
});

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;