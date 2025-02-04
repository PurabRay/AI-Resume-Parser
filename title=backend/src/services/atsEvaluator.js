const axios = require('axios');

// Expect these environment variables to be set in your .env file:
// LLAMA_API_URL - e.g. "https://api.llama.ai"
// LLAMA_API_KEY - your llama api key if required

async function evaluateATS(parsedData, role) {
  try {
    const prompt = `Given the following resume details: ${JSON.stringify(parsedData)} and the desired job role "${role}", perform an ATS evaluation using the following methodology:
1. Identify the required skills for the role. For the role "Full Stack Developer (MERN)", the primary skills are React, Node, Express, and MongoDB (or Mongoose). Do not include the term "MERN" itself in your analysis.
2. For each required skill, examine the resume details (from workExperience, projects, and education) to check for evidence of proficiency.
   - For a MERN role, React and Node should have the highest weight, Express should be given minimal or zero points if not evidenced, and MongoDB/Mongoose has moderate weight.
3. Evaluate the level of proficiency for each skill and assign points based on the evidence—factoring in whether the work experience, projects, or education indicate basic, intermediate, or advanced proficiency.
4. Sum the points from the required skills to compute a core score.
5. For any extra relevant skills not in the core set, assign additional points between 0 and (100 - core score)/5, based on their importance and relevance.
6. The final ATS score is the sum of the core score and extra skills score, capped at 100.
7. Provide a detailed breakdown that includes for each skill examined: the skill name, assigned points, maximum possible points (weight), and a brief explanation of your reasoning.
8. Also, include a "calculations" key containing a full text explanation of how the points were assigned—showing the entire calculation and reasoning.
9. List "missingSkills" as those required skills that are either absent or show insufficient evidence. Do not list the overall job role name (e.g. do not include "MERN Developer"; only list individual skills such as React, Node, Express, or MongoDB if applicable).
Return a JSON object with the keys:
  - atsScore: an integer (final ATS score between 0 and 100),
  - missingSkills: an array of strings,
  - breakdown: an array of objects each with { skill, assignedPoints, maxPoints, reasoning },
  - calculations: a detailed string containing the full calculation and reasoning.
Do not include any markdown formatting in your output.`;
    
    const data = {
      model: "llama-3.1",  // specify the llama model here
      messages: [
        { role: "system", content: "You are an expert HR evaluator." },
        { role: "user", content: prompt }
      ]
    };

    const response = await axios.post(
      process.env.LLAMA_API_URL + '/v1/chat/completions',
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.LLAMA_API_KEY}`
        }
      }
    );

    let responseText = response.data.choices[0].message.content;
    // Remove any markdown formatting that might be present.
    responseText = responseText.replace(/```json\s?/, '').replace(/```/g, '').trim();

    const atsEvaluation = JSON.parse(responseText);
    return atsEvaluation;
  } catch (err) {
    console.error("Error evaluating ATS:", err);
    throw new Error(`Error evaluating ATS: ${err.message}`);
  }
}

module.exports = { evaluateATS }; 