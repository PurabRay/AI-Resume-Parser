const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const axios=require('axios')
const { OpenAI } = require('openai');
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
            content: `Extract key information from this resume in JSON format.
            MAKE SURE YOU RETURN A JSON OBJECT.DO NOT RETURN ANY MARKDOWN OR EXPLAINATIONS. 
            The JSON output should include the keys personalInfo, skills, workExperience, education, certifications, projects, and competitiveProfiles.
            Ensure you also have the skills displayed in work experiences but not present under skills section also present in the skills array.

            Ensure projects is an array of objects where each object contains the keys: 
            - title
            - description
            - skills (an array of strings)
            - proof.
           Ensure you also have the skills displayed in work experiences but not present under skills section also present in the skills array.
            Ensure personalInfo includes fields: 
            - name
            - email
            - phone
            - location 
            
            (If missing, try to infer it from workExperience first, if not found there, infer it from education. 
            If not found there, assign the most suitable location deduced from the resume data). 
            
            Ensure workExperience is an array of objects where each object includes at least: 
            - company
            - title (work role or job title)
            - position (send it with this key)
            - duration (use empty strings for any missing details).
    
            For education, include:
            - institution
            - degree
            - field
            - year if available. 
    
            If a section has no data, return an empty array or an object with empty fields as appropriate.
    
            Ensure all keys use camelCase formatting: 
            - personalInfo
            - skills
            - workExperience
            - education
            - certifications
            - competitiveProfiles.
    
            Ensure competitiveProfiles includes any and all references to platforms such as:
            - LeetCode
            - HackerRank
            - Kaggle
            - Codeforces
            - CodeChef. 
    
            If a profile includes Rating, Rank, Score, or a link, include it as well. 
    
            Do not include any markdown formatting in your output. 
            
            If the field is not mentioned under education, go over the workExperience to determine the field of work of the individual and put it under field in education.`
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