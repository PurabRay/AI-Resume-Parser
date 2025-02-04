const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const { OpenAI } = require('openai');
const Resume = require('../models/Resume');
const Job = require('../models/Job');

// Initialize OpenAI with the API key directly from process.env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY.trim() // Remove any extra whitespace
});

async function parseResume(filePath, userId) {
  const fileExtension = filePath.split('.').pop().toLowerCase();
  let text = '';

  try {
    if (fileExtension === 'pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      text = data.text;
    } else if (fileExtension === 'docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    }

    // Use OpenAI to extract structured information
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Extract key information from this resume in JSON format. Include: personal_info, skills, work_experience, education, and certifications."
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    let jsonResponse = completion.choices[0].message.content;
    // Remove markdown formatting if present
    jsonResponse = jsonResponse.replace(/```json\s?/, '').replace(/```/g, '').trim();

    const parsedData = JSON.parse(jsonResponse);
    
    // Build resume data and include userId only if provided
    const resumeData = {
      parsedData,
      originalFileName: filePath.split('/').pop(),
      score: 0
    };

    if (userId) {
      resumeData.userId = userId;
    }

    const resume = new Resume(resumeData);
    await resume.save();
    return resume;

  } catch (error) {
    console.error('Error in parseResume:', error);
    throw new Error(`Error parsing resume: ${error.message}`);
  } finally {
    // Clean up uploaded file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

module.exports = { parseResume }; 