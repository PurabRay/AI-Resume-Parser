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
    }, projects: [{

      title: String,

      description: String,

      technologies: [String],
      proof:String

    }],
    competitiveProfiles: {
        type: [mongoose.Schema.Types.Mixed],
           default: [{
            rating:String,
            rank:String,
            score:String,
            link:String
           }]
         }
        
  },
  atsEvaluation: {
       atsScore: Number,
       missingSkills: [String],
        breakdown: { type: [mongoose.Schema.Types.Mixed], default: [] },
        calculations: String
      },
  originalFileName: String,
  score: Number,
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema); 