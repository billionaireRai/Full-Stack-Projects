const mongoose = require('mongoose');

// This is my mongoose schema for customer tasks
const TaskSchema = new mongoose.Schema({
   Password: { type: String, required: true },
  Task: {
    type: [String],
    required: true,
  },
});

const customertasks = mongoose.model('customertasks', TaskSchema);

module.exports = customertasks;
