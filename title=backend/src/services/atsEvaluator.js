const axios = require('axios');

async function evaluateATS(parsedData, role) {
  try {
    const prompt = `Given the following resume details: ${JSON.stringify(parsedData)} and the desired job role "${role}", perform an ATS evaluation using the following methodology:

Identify the required skills for the role. For the role "Full Stack Developer (MERN)", the primary skills are React, Node, Express, and MongoDB (or Mongoose). Do not include the term "MERN" itself in your analysis.

For each required skill, examine the resume details (from workExperience, projects, and education) to check for evidence of proficiency.  
- For a MERN role, React and Node should have the highest weight, Express should be given minimal or zero points if not evidenced, and MongoDB/Mongoose has moderate weight.

Evaluate the level of proficiency for each skill and assign points based on the evidence—factoring in whether the work experience, projects, or education indicate basic, intermediate, or advanced proficiency. Make sure the total number of points you assign to the skills required for the job role sums up to 95.

Sum the points from the required skills to compute a core score.
Ensure that proficiency levels are strictly categorized as follows when assigning points. Assign points proportionally within these categories. **Intermediate proficiency should not receive the maximum score.** If evidence is unclear, default to the lower bound of the respective proficiency level.

---
#### Detailed Core Skill Evaluation Instructions (Individual for Each Skill)

For each core skill (React, Node.js, Express.js, MongoDB), use the following 10% gap breakdown to assign points based on the evidence found in work experience, projects, or education. Use the exact maximum points per skill as defined (React: 42, Node.js: 40, Express.js: 8, MongoDB: 5). Points must be assigned strictly within these ranges, with inference applied only as specified.

-- React (Max 42 Points) --
• 0–10% (0–4.2 points): Minimal Exposure – Only theoretical knowledge (coursework, tutorials) with no practical project evidence.
   Example: Completed a React course with no hands-on project.
• 11–20% (4.3–8.4 points): Basic Proficiency – Evidence of a very simple project (e.g., static webpage) showing only basic component rendering.
• 21–30% (8.5–12.6 points): Lower Intermediate – A project demonstrates fundamental React concepts (useState, props, basic event handling) without complex state management.
• 31–40% (12.7–16.8 points): Upper Intermediate – A project showing dynamic data fetching and use of React Hooks (useEffect, useContext) with a structured architecture.
• 41–50% (16.9–21.0 points): Moderate Advanced – Evidence of robust state management (Context API or basic Redux) and improved component reusability.
• 51–60% (21.1–25.2 points): Advanced – Projects include performance optimizations (lazy loading, memoization) and error boundaries.
• 61–70% (25.3–29.4 points): Very Advanced – Demonstrates near-production-level skills with modular architecture and complex component interactions.
• 71–80% (29.5–33.6 points): Expert Intermediate – Multiple projects showing consistent high-quality usage, possibly including SSR frameworks (e.g., Next.js) in some instances.
• 81–90% (33.7–37.8 points): Expert – Strong production-ready applications with deep performance tuning and accessibility best practices.
• 91–100% (37.9–42 points): Mastery – Enterprise-level expertise with evidence of complex optimizations, scalable architectures, and advanced React patterns.

-- Node.js (Max 40 Points) --
• 0–10% (0–4 points): Minimal Exposure – Basic server setup without evidence of API development or error handling.
   Example: A simple Node.js script returning static JSON.
• 11–20% (4.1–8 points): Basic Proficiency – Evidence of simple API endpoints, minimal RESTful practices.
• 21–30% (8.1–12 points): Lower Intermediate – Projects show basic API routes, basic middleware usage, and minimal database connection.
• 31–40% (12.1–16 points): Upper Intermediate – Demonstrates working REST APIs with error handling, basic JWT authentication, and clear API structure.
• 41–50% (16.1–20 points): Moderate Advanced – Projects include enhanced security, some asynchronous processing, or preliminary real-time features.
• 51–60% (20.1–24 points): Advanced – Evidence of robust API handling with proper middleware, authentication, and some performance optimizations.
• 61–70% (24.1–28 points): Very Advanced – Projects include more complex features such as real-time capabilities (e.g., WebSockets) and reliable error recovery.
• 71–80% (28.1–32 points): Expert Intermediate – Multiple projects showing advanced error handling, middleware layering, and scalability in API design.
• 81–90% (32.1–36 points): Expert – Production-ready systems with integrated security, efficient resource management, and thorough API documentation.
• 91–100% (36.1–40 points): Mastery – Demonstrated through enterprise-level applications with microservices, caching strategies, and high performance under load.

-- Express.js (Max 8 Points) --
• 0–10% (0–0.8 points): Minimal Exposure – Basic setup of Express with simple GET routes only.
• 11–20% (0.9–1.6 points): Basic Proficiency – Simple middleware usage (e.g., body-parser) without structured API design.
• 21–30% (1.7–2.4 points): Lower Intermediate – Evidence of basic API structuring and modular routing.
• 31–40% (2.5–3.2 points): Upper Intermediate – Projects showing well-organized middleware, route separation, and basic authentication integration.
• 41–50% (3.3–4.0 points): Moderate Advanced – Use of advanced middleware functions, error handling, and validation.
• 51–60% (4.1–4.8 points): Advanced – Evidence of robust API structuring with security measures (rate limiting, logging).
• 61–70% (4.9–5.6 points): Very Advanced – Consistent, well-documented Express usage across multiple endpoints with optimization.
• 71–80% (5.7–6.4 points): Expert Intermediate – Projects include integration with other frameworks or microservices, showing significant design improvements.
• 81–90% (6.5–7.2 points): Expert – Strong API architecture with clear modularity and best practices.
• 91–100% (7.3–8 points): Mastery – Enterprise-grade Express applications with complete optimization, security, and scalability.

-- MongoDB (Max 5 Points) --
• 0–10% (0–0.5 points): Minimal Exposure – Basic CRUD without advanced querying or schema design.
• 11–20% (0.6–1.0 points): Basic Proficiency – Simple database usage with Mongoose schemas, no indexing or aggregation.
• 21–30% (1.1–1.5 points): Lower Intermediate – Evidence of using schema design and basic query optimizations.
• 31–40% (1.6–2.0 points): Upper Intermediate – Projects include indexing, relations (populate/virtuals), or basic aggregation pipelines.
• 41–50% (2.1–2.5 points): Moderate Advanced – Evidence of handling more complex queries or multiple collections with relationships.
• 51–60% (2.6–3.0 points): Advanced – Implementation of replica sets, transactions, or optimized query strategies.
• 61–70% (3.1–3.5 points): Very Advanced – Clear demonstration of performance optimizations and efficient data handling.
• 71–80% (3.6–4.0 points): Expert Intermediate – Projects include significant schema optimization and complex aggregations.
• 81–90% (4.1–4.5 points): Expert – Production-grade database implementations with indexing and performance tuning.
• 91–100% (4.6–5 points): Mastery – Enterprise-level MongoDB architecture with high availability and advanced replication strategies.

#### Inference and Adjustment Rules (Applied Individually)
• If a core skill is not explicitly mentioned in a project or work experience, infer it from related evidence:
   - For Node.js: If Express.js is used, assign at least the minimal inferred Node.js score (minimum 4.1 points if no explicit Node.js evidence).
   - For MongoDB: If backend projects (e.g., authentication systems) are present but do not mention a database, assign a minimal inferred score (e.g., 0.6–1.0 points) unless another database is explicitly stated.
• For each skill, if the evidence suggests only the lower boundary of a proficiency level, do not round up to a higher level—assign the lower boundary score exactly.

#### Extra Skill Evaluation Instructions
After core skills are evaluated:
• Identify extra relevant skills from the resume (e.g., PowerBI, MySQL, competitive programming ratings, etc.).
• For each extra skill, assign extra points using the formula: Extra Skill Points = (100 - Core Score) / 5, and justify with evidence.
• Provide a detailed breakdown for each extra skill, including:
   - Skill name and assigned points.
   - Why it is relevant for a Full Stack Developer role.
   - Specific evidence from projects, work experience, or certifications.
   - A clear explanation of the calculation.

#### Calculation Consolidation

• Sum extra skill points as calculated (not exceeding the allotted buffer based on the formula).
• Provide a final JSON object with:
   - "atsScore": Final ATS score (integer between 0 and 100)
   - "missingSkills": Array of required skills with insufficient evidence (explicitly assign 0 points)
   - "breakdown": Array of objects for each core and extra skill, each containing "skill", "assignedPoints", "maxPoints", and "reasoning"
   - "calculations": A detailed string showing every calculation step, the reasoning for each point assignment, and the evidence used for inferences.

These instructions must be strictly followed to minimize any deviation in point allocation, ensuring that every detail is accounted for even when inferences are made.

Moderation Rules for ATS Scoring**
🔹 **Intermediate proficiency (Upper Intermediate) should never exceed 70-85% of max score.**  
🔹 **If a skill is implied but not explicitly mentioned, assign a conservative lower boundary score.**  
🔹 **Basic proficiency should not exceed 30% of the max score unless justified by multiple projects.**  
🔹 **Provide explicit reasoning in the "breakdown" to justify assigned points.

---
Total Points:
- React (Max 42)
- Node.js (Max 40) 
- Express.js (Max 8)  
- MongoDB (Max 5)
- Total = 95 (with 5-point buffer)  

---
For any extra relevant skills not in the core set, assign additional points between 0 and (100 - core score)/5, based on their importance and relevance.

The final ATS score is the sum of the core score and extra skills score, capped at 100.

Provide a detailed breakdown that includes for each skill examined: the skill name, assigned points, maximum possible points (weight), and a brief explanation of your reasoning.

Also, include a "calculations" key containing a full text explanation of how the points were assigned—showing the entire calculation and reasoning.

List "missingSkills" as those required skills that are either absent or show insufficient evidence. Do not list the overall job role name (e.g. do not include "MERN Developer"; only list individual skills such as React, Node, Express, or MongoDB if applicable).

Return a JSON object with the keys:  
- atsScore: an integer (final ATS score between 0 and 100)  
- missingSkills: an array of strings  
- breakdown: an array of objects each with { skill, assignedPoints, maxPoints, reasoning }  
- calculations: a detailed string containing the full calculation and reasoning.

Do not include any markdown formatting in your output.`;
    
    const response = await axios.post(
      process.env.MISTRAL_API_URL + '/v1/chat/completions',
      {
        model: "mistral-7B-chat",  // adjust model as needed
        messages: [
          { role: "system", content: "You are an expert HR evaluator." },
          { role: "user", content: prompt }
        ],
        max_tokens: 1000
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`
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