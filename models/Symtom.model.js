const mongoose = require('mongoose');
const { Schema } = mongoose;

const symptomSchema = new Schema({
  name:  String,
});

const Symptom = mongoose.model('Symptom', symptomSchema);

module.exports = Symptom;