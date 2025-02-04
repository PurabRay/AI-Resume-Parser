const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  requirements: [String],
  location: String,
  salary: {
    min: Number,
    max: Number,
    currency: String
  },
  applications: [{
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume'
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected'],
      default: 'pending'
    },
    matchScore: Number
  }],
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema); 