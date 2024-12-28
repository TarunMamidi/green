const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    required: true
  }
});

const policySchema = new mongoose.Schema({
  locationType: {
    type: String,
    required: true
  },
  sbu: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'draft',
    enum: ['draft', 'approved', 'rejected']  // Optional, if you have predefined status values
  },
  policyNumber: {
    type: String,
    unique: true,
    required: true
  },
  classification: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  comments: [commentSchema]  
});

const Policy = mongoose.model('Policy', policySchema);

module.exports = Policy;
