const axios = require('axios');

const KRUTRIM_API_KEY = process.env.KRUTRIM_API_KEY.trim(); // Ensure this is set in your environment variables
const KRUTRIM_API_URL = 'https://cloud.olakrutrim.com/v1/chat/completions';

async function evaluateATSL(parsedData, role) {
  try {
    const prompt = `
      You are an ATS (Applicant Tracking System) evaluator. Analyze the following resume for a ${role} position:
      ${JSON.stringify(parsedData)}
Respond with a valid JSON object only.
RETURN ONLY A VALID JSON OBJECT
Do not include any markdown formatting in your output.

Evaluate the resume and provide:
1. A score out of 100
2. A breakdown of points for each required skill (showing reasoning and points assigned)
3. A list of missing but required skills
4. For each missing skill, provide learning resources categorized as basic, intermediate, and advanced (2-3 resources with URLs for each level)

Format your response as a JSON object with this structure:
{
  "atsScore": sum of all the points assigned to individual skills,
  "breakdown": [
    {
      "skill": string,
      "reasoning": string,
      "assignedPoints": number,
      "maxPoints": number
    }
  ],
  "missingSkills": string[],
  "learningResources": {
    "skillName": {
      "basic": [{"title": string, "url": string, "description": string}],
      "intermediate": [{"title": string, "url": string, "description": string}],
      "advanced": [{"title": string, "url": string, "description": string}]
    }
  }
}

    `;

    const response = await axios.post(
      KRUTRIM_API_URL,
      {
        model: "Meta-Llama-3.1-70B-Instruct",
        messages: [
          {
            role: "system",
            content: "You are an expert TechnicalHR evaluator."
          },
          {
            role: "user",
            content: prompt
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

    let responseText = response.data.choices[0].message.content;
    // Remove any markdown formatting that might be present
    responseText = responseText.replace(/```json\s?/, '').replace(/```/g, '').trim();

    const atsEvaluation = JSON.parse(responseText);
    return atsEvaluation;
  } catch (err) {
    console.error("Error evaluating ATS for Lawyer:", err);
    throw new Error(`Error evaluating ATS for Lawyer: ${err.message}`);
  }
}

async function evaluateATSD(parsedData, role) {
  try {
    const prompt = `You are an ATS (Applicant Tracking System) evaluator. Analyze the following resume for a ${role} position:${JSON.stringify(parsedData)}
Respond with a valid JSON object only.
RETURN ONLY A VALID JSON OBJECT
Do not include any markdown formatting in your output.
EVALUATE USING THIS BREAKDOWN:
Key Disciplines & Weight Distribution (Total: 95%)
Each discipline is assigned a percentage weight based on industry relevance. The sub-percentages within each discipline are relative to that discipline’s total weight.

1. Criminal Law & Legal Knowledge (30%)
0-33% (0-10 points out of 30): Basic understanding of privacy laws, evidence handling, and legal documentation.
34-66% (10-20 points out of 30): Some coursework, certification, or practical exposure in legal studies, law enforcement policies, or investigative procedures.
67-100% (20-30 points out of 30): Strong legal knowledge through prior work experience, litigation support, or direct law enforcement involvement.

2. Investigative Techniques & Research (30%)
0-33% (0-10 points out of 30): Basic knowledge of background checks, surveillance techniques, and open-source intelligence (OSINT).
34-66% (10-20 points out of 30): Familiarity with investigative tools, forensic research, or direct hands-on investigative experience.
67-100% (20-30 points out of 30): Strong investigative skills, including fraud detection, interviewing witnesses, or advanced surveillance methods.

3. Forensic Analysis & Technology (20%)
0-25% (0-5 points out of 20): Basic familiarity with digital forensics, cybersecurity principles, or evidence preservation.
26-75% (5-15 points out of 20): Experience in data recovery, forensic accounting, or cyber investigations.
76-100% (15-20 points out of 20): Hands-on expertise in forensic analysis, working with law enforcement databases, or conducting full forensic audits.

4. Psychology & Behavioral Analysis (10%)
0-50% (0-5 points out of 10): Basic understanding of human behavior, body language, and deception detection.
51-100% (5-10 points out of 10): Formal education in psychology, criminology, or behavioral profiling with applied experience.

5. Communication & Report Writing (5%)
0-50% (0-2.5 points out of 5): Basic documentation skills and professional email writing.
51-100% (2.5-5 points out of 5): Experience in writing case reports, client communication, or drafting court-admissible documentation.


Evaluate the resume and provide:
1. A score out of 100
2. A breakdown of points for each required skill (showing reasoning and points assigned)
3. A list of missing but required skills
4. For each missing skill, provide learning resources categorized as basic, intermediate, and advanced (2-3 resources with URLs for each level)

{
  
  "breakdown": [
    {
      "skill": string,
      "reasoning": string,
      "assignedPoints": number,
      "maxPoints": number
    }
  ],
  "missingSkills": string[],
  "learningResources": {
    "skillName": {
      "basic": [{"title": string, "url": string, "description": string}],
      "intermediate": [{"title": string, "url": string, "description": string}],
      "advanced": [{"title": string, "url": string, "description": string}]
    }
  }
}
`; // The exact prompt you provided for Detectives remains unchanged

    const response = await axios.post(
      KRUTRIM_API_URL,
      {
        model: "Meta-Llama-3.1-70B-Instruct",
        messages: [
          {
            role: "system",
            content: "You are an expert TechnicalHR evaluator."
          },
          {
            role: "user",
            content: prompt
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

    let responseText = response.data.choices[0].message.content;
    responseText = responseText.replace(/```json\s?/, '').replace(/```/g, '').trim();

    const atsEvaluation = JSON.parse(responseText);
    return atsEvaluation;
  } catch (err) {
    console.error("Error evaluating ATS for Detective:", err);
    throw new Error(`Error evaluating ATS for Detective: ${err.message}`);
  }
}

async function evaluateATS(parsedData, role) {
  try {
    const prompt = `Given the following resume details: ${JSON.stringify(parsedData)} and the desired job role "${role}", perform an ATS evaluation using the following methodology:
RETURN ONLY A VALID JSON OBJECT ANYTHING OTHER THAN THAT WILL NOT WORK PLEASE ADHERE TO THIS.
Instructions for ATS Evaluation (Return a Single Valid JSON Object):

CORE SKILLS (Total: 95 Points):

Required Skills: • React (max 42 points) • Node.js (max 40 points) • Express.js (max 8 points) • MongoDB/Mongoose (max 5 points)

Note: Do not include the term “MERN” in Missing skills, only what is missing of it e.g.(MongoDB,Express,React,Node).

Evidence Sources: Evaluate workExperience, projects, and education for proficiency.

Point Assignment: Follow these exact distribution ranges for each skill based on proficiency levels. If evidence is unclear, assign the lower boundary without rounding up.

• React (Max 42):

0–10% (0–4.2 points): Minimal Exposure (e.g., basic component creation, lifecycle, simple rendering)
11–20% (4.3–8.4 points): Lower Basic Proficiency (e.g., multiple component interactions, basic props/state management)
21–30% (8.5–12.6 points): Intermediate Basic Proficiency (e.g., useState, conditional rendering, basic data manipulation)
31–40% (12.7–16.8 points): Higher Basic Proficiency (e.g., useEffect for side effects, API data fetching, basic error handling)
41–50% (16.9–21.0 points): Lower Intermediate (e.g., Context API, custom hooks, advanced prop management)
51–60% (21.1–25.2 points): Moderate Intermediate (e.g., advanced hook usage, comprehensive error handling)
61–70% (25.3–29.4 points): Higher Intermediate (e.g., advanced state management, performance tuning)
71–80% (29.5–33.6 points): Lower Advanced (e.g., code splitting with React.lazy(), advanced design patterns)
81–90% (33.7–37.8 points): Moderate Advanced (e.g., server-side rendering, advanced performance profiling)
91–100% (37.9–42 points): Mastery (e.g., custom rendering engines, comprehensive design systems)
• Node.js (Max 40):

0–10% (0–4 points): Minimal Exposure (e.g., basic server setup, simple routing)
11–20% (4.1–8 points): Lower Basic Proficiency (e.g., basic Express routing, simple HTTP request handling)
21–30% (8.1–12 points): Intermediate Basic Proficiency (e.g., introductory async programming, basic middleware, simple DB connections)
31–40% (12.1–16 points): Higher Basic Proficiency (e.g., multiple routes, comprehensive error handling)
41–50% (16.1–20 points): Lower Intermediate (e.g., more complex routing, basic rate limiting)
51–60% (20.1–24 points): Moderate Intermediate (e.g., multiple middleware strategies, basic authentication, advanced error logging)
61–70% (24.1–28 points): Higher Intermediate (e.g., robust authentication, advanced NPM package integration, complex middleware)
71–80% (28.1–32 points): Lower Advanced (e.g., advanced error recovery, performance optimization, WebSocket implementation)
81–90% (32.1–36 points): Intermediate Advanced (e.g., enterprise-level error handling, full microservices architecture)
91–100% (36.1–40 points): Mastery (e.g., advanced architectural patterns, cutting-edge scalability)
• Express.js (Max 8):

0–10% (0–0.8 points): Minimal Exposure (e.g., basic setup with simple GET routes)
11–20% (0.9–1.6 points): Basic Proficiency (e.g., simple middleware usage such as body-parser)
21–30% (1.7–2.4 points): Lower Intermediate (e.g., basic API structuring and modular routing)
31–40% (2.5–3.2 points): Upper Intermediate (e.g., well-organized middleware, route separation)
41–50% (3.3–4.0 points): Moderate Advanced (e.g., advanced middleware functions, error handling, validation)
51–60% (4.1–4.8 points): Advanced (e.g., robust API structuring with security measures)
61–70% (4.9–5.6 points): Very Advanced (e.g., consistent and well-documented Express usage across multiple endpoints)
71–80% (5.7–6.4 points): Expert Intermediate (e.g., integration with other frameworks or microservices)
81–90% (6.5–7.2 points): Expert (e.g., strong API architecture with clear modularity and best practices)
91–100% (7.3–8 points): Mastery (e.g., enterprise-grade Express applications with full optimization, security, and scalability)
• MongoDB (Max 5):

0–10% (0–0.5 points): Minimal Exposure (e.g., basic CRUD operations without advanced querying)
11–20% (0.6–1.0 points): Basic Proficiency (e.g., simple usage with Mongoose, basic schemas, no indexing)
21–30% (1.1–1.5 points): Lower Intermediate (e.g., evidence of schema design and basic query optimizations)
31–40% (1.6–2.0 points): Upper Intermediate (e.g., use of indexing, relations like populate/virtuals, basic aggregation)
41–50% (2.1–2.5 points): Moderate Advanced (e.g., complex queries, multi-collection relationships)
51–60% (2.6–3.0 points): Advanced (e.g., implementation of replica sets, transactions, optimized queries)
61–70% (3.1–3.5 points): Very Advanced (e.g., performance optimizations, efficient data handling)
71–80% (3.6–4.0 points): Expert Intermediate (e.g., significant schema optimization, complex aggregations)
81–90% (4.1–4.5 points): Expert (e.g., production-grade implementations with indexing and performance tuning)
91–100% (4.6–5 points): Mastery (e.g., enterprise-level architecture with high availability and advanced replication strategies)




FINAL ATS SCORE:

Calculate by summing the core score (maximum 95 points).


Return a JSON object with the keys:  

- missingSkills: an array of strings  
- breakdown: an array of objects each with { skill, assignedPoints, maxPoints, reasoning }  
- calculations: a detailed string containing the full calculation and reasoning.  
- "learningResources": {
    "skillName": {
      "basic": [{"title": string, "url": string, "description": string}],
      "intermediate": [{"title": string, "url": string, "description": string}],
      "advanced": [{"title": string, "url": string, "description": string}]
    }

Do not include any markdown formatting in your output.
- Ensure your response is a single valid JSON object with no additional text or formatting outside of it.
- Strictly follow the point distribution and do not exceed the 95-point total for React, Node.js, Express.js, and MongoDB combined.
- If a skill is only inferred and not explicitly stated, default to the lowest boundary of that skill’s range without rounding up.
- Do not list the job role (e.g. 'Full Stack Developer') under missing skills—only list the individual missing core skills.
- If any core skill is absent or has insufficient evidence, explicitly set assignedPoints to 0 for that skill and include it in missingSkills.

- Provide learning resources for each missing core skill with 2-3 resource entries each under basic, intermediate, and advanced categories.

`; // The exact prompt for the general ATS evaluation remains unchanged

    const response = await axios.post(
      KRUTRIM_API_URL,
      {
        model: "Meta-Llama-3.1-70B-Instruct",
        messages: [
          {
            role: "system",
            content: "You are an expert TechnicalHR evaluator."
          },
          {
            role: "user",
            content: prompt
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

    let responseText = response.data.choices[0].message.content;
    responseText = responseText.replace(/```json\s?/, '').replace(/```/g, '').trim();

    const atsEvaluation = JSON.parse(responseText);
    return atsEvaluation;
  } catch (err) {
    console.error("Error evaluating ATS:", err);
    throw new Error(`Error evaluating ATS: ${err.message}`);
  }
}

function evaluateRoleBasedATS(parsedData, role) {
  switch (role.toLowerCase()) {
    case "detective":
      return evaluateATSD(parsedData, role);
    case "lawyer":
      return evaluateATSL(parsedData, role);
    default:
      return evaluateATS(parsedData, role);
  }
}

module.exports = { evaluateATS, evaluateATSD, evaluateATSL, evaluateRoleBasedATS };
