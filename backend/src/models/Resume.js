const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  parsedData: {
    personalInfo: {
      name: String,
      email: String,
      phone: String,
      location: String
    },
    skills: [String],
    workExperience: [{
      company: String,
      position: String,
      duration: String,
      description: String
    }],
    education: [{
      institution: String,
      degree: String,
      field: String,
      year: String
    }],
    certifications: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    }
  },
  originalFileName: String,
  score: Number,
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema); 