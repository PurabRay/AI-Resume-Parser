require('dotenv').config();


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });


if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set in environment variables');
  process.exit(1);
}

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { parseResume } = require('./services/resumeParser');
const { evaluateATS,evaluateATSD, evaluateATSL, evaluateRoleBasedATS } = require('./services/atsEvaluator');

const app = express();
const port = 5000;
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
    }
  }
});
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
app.post('/api/resume/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
 const parsedResume = await parseResume(req.file.path);
     //Checking forATS role from form-data;it is assumed to be passed as'atsRole'
    let atsEvaluation = null;
   
    if (req.body.atsRole) {
      atsEvaluation = await evaluateRoleBasedATS(parsedResume.parsedData, req.body.atsRole);
      parsedResume.atsEvaluation = atsEvaluation;
            await parsedResume.save();
    }

    res.json({ 
      message: 'Resume uploaded successfully',
      parsedData: parsedResume,
      atsEvaluation: atsEvaluation,
      parsedData: parsedResume,
      atsEvaluation: atsEvaluation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 
