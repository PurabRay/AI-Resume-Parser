const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const { OpenAI } = require('openai');
const axios = require('axios');
const Resume = require('../models/Resume');
const Job = require('../models/Job');
const KRUTRIM_API_KEY = process.env.KRUTRIM_API_KEY.trim(); // Ensure this is set in your environment variables
const KRUTRIM_API_URL = 'https://cloud.olakrutrim.com/v1/chat/completions'
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
    const response = await axios.post(
      KRUTRIM_API_URL,
      {
        model: "Meta-Llama-3.1-70B-Instruct",
        messages: [
          {
            role: "system",
          content: "Extract key information from this resume IN STRICT JSON format with NO extra text, NO explanations, and NO markdown. The JSON output should include the keys personal_info, skills, work_experience, education,certifications and projects and competitiveProfiles.Ensure projects is an array of objects where each object contains the keys:title,description,skills(an array of strings) and proof.Ensure personal_info includes fields: name, email, phone, and location (If missing try to infer it from work experience first, if not found there infer it from education,if not found there assign the most suitable location deduced from the resume data). Ensure work_experience is an array of objects where each object includes at least company, title,work role or job title and send it with postion as the key and duration (use empty strings for any missing details). For education, include institution, degree, field, and year if available. If a section has no data, return an empty array or an object with empty fields as appropriate.Ensure all keys use camelCase formatting: personalInfo, skills, workExperience, education, certifications, and competitiveProfiles.Ensure competitiveProfiles includes any and all references to platforms such as LeetCode, HackerRank, Kaggle, Codeforces, and CodeChef.If a profile includes Rating,Rank or score or a link, Include it as well. Do not include any markdown formatting in your output.If the field is not mentioned under education go over the workExperience to determine the field of work of the individual and put it under field under education"
          },
          {
            role: "user",
            content: text
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${KRUTRIM_API_KEY}`
        }
      }
    );

    let jsonResponse = response.data.choices[0].message.content;

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