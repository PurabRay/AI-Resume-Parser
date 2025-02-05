const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY.trim()
});

async function evaluateATS(parsedData, role) {
  try {
    const prompt = `Given the following resume details: ${JSON.stringify(parsedData)} and the desired job role "${role}", perform an ATS evaluation using the following methodology:

Identify the required skills for the role. For the role "Full Stack Developer (MERN)", the primary skills are React, Node, Express, and MongoDB (or Mongoose). Do not include the term "MERN" itself in your analysis.

For each required skill, examine the resume details (from workExperience, projects, and education) to check for evidence of proficiency.  
- For a MERN role, React and Node should have the highest weight, Express should be given minimal or zero points if not evidenced, and MongoDB/Mongoose has moderate weight.

Evaluate the level of proficiency for each skill and assign points based on the evidence—factoring in whether the work experience, projects, or education indicate basic, intermediate, or advanced proficiency.Make sure the total number of points you assign to the skills required for the job role sums up to 95.

Sum the points from the required skills to compute a core score.
Ensure that proficiency levels are strictly categorized as follows when assigning points. Assign points proportionally within these categories. **Intermediate proficiency should not receive the maximum score.** If evidence is unclear, default to the lower bound of the respective proficiency level.

---
#### Detailed Core Skill Evaluation Instructions (Individual for Each Skill)

For each core skill (React, Node.js, Express.js, MongoDB), use the following 10% gap breakdown to assign points based on the evidence found in work experience, projects, or education. Use the exact maximum points per skill as defined (React: 42, Node.js: 40, Express.js: 8, MongoDB: 5). Points must be assigned strictly within these ranges, with inference applied only as specified.

• 0–10% (0–4.2 points): Minimal Exposure:
Basic React component creation
Understanding of component lifecycle
Simple rendering concepts
Limited interactivity
• 11–20% (4.3–8.4 points): Lower Basic Proficiency:
Multiple component interactions

Basic props and state management
Simple event handling
Initial understanding of component structure
• 21–30% (8.5–12.6 points): Intermediate Basic Proficiency
useState hook proficiency
Conditional rendering
Basic data manipulation
Simple form handling and validation
• 31–40% (12.7–16.8 points): Higher Basic Proficiency

useEffect for side effects
API data fetching
Error handling basics
More sophisticated state logic
Basic routing understanding
• 41–50% (16.9–21.0 points): Lower Intermediate
Context API implementation
Custom hooks creation
Component composition
More advanced prop management
Basic state lifting techniques

• 51–60% (21.1–25.2 points): Moderate Intermediate
Advanced hook usage
Comprehensive error handling
Complex state management patterns
Basic code splitting
Advanced component design
• 61–70% (25.3–29.4 points): Higher Intermediate

Redux or Zustand advanced implementation
Complex state management solutions
Advanced data flow management
Performance tuning
Advanced memoization techniques
Sophisticated routing implementations
• 71–80% (29.5–33.6 points): Lower Advanced
Implement code splitting with React.lazy() and Suspense
Dynamic imports for route-based splitting
Advanced component design patterns (HOC, render props)
Performance optimization using React.memo()
Implement complex error boundaries

Develop custom middleware for state management
Create reusable, highly generic component libraries
• 81–90% (33.7–37.8 points): Moderate Advanced
Server-side rendering with Next.js or similar frameworks
Advanced performance profiling and optimization
Implement complex state hydration techniques
Create custom hooks with advanced logic and memoization
Develop micro-frontend architectures
Advanced webpack/build configuration
Implement advanced accessibility patterns
Complex state synchronization across multiple components
• 91–100% (37.9–42 points): Mastery
Develop custom React rendering engines
Create complex state management solutions from scratch
Advanced performance optimization beyond standard techniques
Implement advanced code-splitting strategies
Create comprehensive design systems
Develop advanced testing strategies for complex React applications
Create custom compiler optimizations
Implement advanced internationalization techniques

-- Node.js (Max 40 Points) --
• 0–10% (0–4 points): Minimal Exposure:
Basic Node.js server setup
Simple routing

11–20% (4.1–8 points): Lower Basic Proficiency:
Basic Express.js routing
Simple HTTP request handling
Minimal error handling
• 21–30% (8.1–12 points): Intermediate Basic Proficiency:
Introductory async programming
Basic middleware
Simple database connections
•31–40% (12.1–16 points): Higher Basic Proficiency:
Multiple route implementations
Comprehensive error handling

•41–50% (16.1–20 points): Lower Intermediate:
More complex routing

Basic rate limiting
Simple background job processing
•51–60% (20.1–24 points): Moderate Intermediate:

Multiple middleware strategies
Basic authentication
Complex middleware layering
Advanced error logging
 security practices
• 61–70% (24.1–28 points): Higher Intermediate:
More robust authentication
Advanced authentication mechanisms
Sophisticated NPM package integration
Token refresh mechanisms
Complex middleware composition
Comprehensive logging systems
• 71–80% (28.1–32 points): Lower Advanced:
Advanced error recovery
Performance optimization
WebSocket implementation
Advanced database query optimization
Advanced role-based access control
Initial microservices architecture
Distributed system design basics
•81–90% (32.1–36 points): Intermediate Advanced:
Advanced security protocols
Enterprise-level error handling
Full microservices architecture
Advanced system design
Comprehensive security implementations
• 91–100% (36.1–40 points): Mastery:
Enterprise-level distributed systems
Advanced architectural patterns
Cutting-edge scalability solutions

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
• For each extra skill, assign extra points using the formula: Extra Skill Points = (100 - Core Score) / 10, and justify with evidence.A maximum of 5 points can be alloted to each Extra Skill.
• Provide a detailed breakdown for each extra skill, including:
   - Skill name and assigned points.
   - Why it is relevant for a Full Stack Developer role.
   - Specific evidence from projects, work experience, or certifications.
   - A clear explanation of the calculation.

#### Calculation Consolidation

• Sum extra skill points as calculated (not exceeding the allotted buffer based on the formula).
•NO EXTRA SKILL SHOULD HAVE MORE WEIGHTAGE THAN FIVE POINTS. IF THE APPLICANT HAS AN IMPRESSIVE COMPETITIVE PROFILES THEY SHOULD BE SCORED ASSIGNED POINTS ON THE BASIS OF THEIR MOST IMPRESSIVE COMPETITIVE RANKING FOR ONLY ONE PROFILE AND THIS SHOULD BE COUNTED UNDER EXTRA SKILS.
•THE ONLY THINGS COUNTED UNDER EXTRA SKILLS SHOULD BE:COMPETITVE PARTICIPATION,genAI INVOLVEMENT, WORK ON EXTRA FRONTEND OR BACKEND FRAMEWORKS OUTSIDE OF MERN.MAXIMUM FIVE POINTS CAN BE ALLOTED TO ANY EXTRA SKILL.THE SUM OF THE POINTS ALLOTED TO EXTRA SKILLS SHOULD NOT EXCEED 10.
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
- Total = 95  

---



For any extra relevant skills not in the core set, assign additional points between 0 and (100 - core score)/10, based on their importance and relevance.

Given the following resume details: ${JSON.stringify(parsedData)} and the desired job role "${role}", perform an ATS evaluation using the following methodology:

Identify the required skills for the role. For the role "Full Stack Developer (MERN)", the primary skills are React, Node, Express, and MongoDB (or Mongoose). Do not include the term "MERN" itself in your analysis.

For each required skill, examine the resume details (from workExperience, projects, and education) to check for evidence of proficiency.  
- For a MERN role, React and Node should have the highest weight, Express should be given minimal or zero points if not evidenced, and MongoDB/Mongoose has moderate weight.

Evaluate the level of proficiency for each skill and assign points based on the evidence—factoring in whether the work experience, projects, or education indicate basic, intermediate, or advanced proficiency.

Sum the points from the required skills to compute a core score.

For any extra relevant skills not in the core set, assign additional points between 0 and (100 - core score)/10, based on their importance and relevance.

The final ATS score is the sum of the core score and extra skills score, capped at 100.

Provide a detailed breakdown that includes for each skill examined: the skill name, assigned points, maximum possible points (weight), and a brief explanation of your reasoning.

Also, include a "calculations" key containing a full text explanation of how the points were assigned—showing the entire calculation and reasoning.

List "missingSkills" as those required skills that are either absent or show insufficient evidence. Do not list the overall job role name (e.g. do not include "MERN Developer"; only list individual skills such as React, Node, Express, or MongoDB if applicable).

Return a JSON object with the keys:  
- atsScore: an integer (final ATS score between 0 and 100)  
- missingSkills: an array of strings  
- breakdown: an array of objects each with { skill, assignedPoints, maxPoints, reasoning }  
- calculations: a detailed string containing the full calculation and reasoning.  
- For each missing skill, provide learning resources categorized as basic, intermediate, and advanced (2-3 resources with URLs for each level)

The final ATS score is the sum of the core score and extra skills score, capped at 100.

Provide a detailed breakdown that includes for each skill examined: the skill name, assigned points, maximum possible points (weight), and a brief explanation of your reasoning.

Also, include a "calculations" key containing a full text explanation of how the points were assigned—showing the entire calculation and reasoning.

List "missingSkills" as those required skills that are either absent or show insufficient evidence. Do not list the overall job role name (e.g. do not include "MERN Developer"; only list individual skills such as React, Node, Express, or MongoDB if applicable).

Return a JSON object with the keys:  
- atsScore: an integer (final ATS score between 0 and 100)  
- missingSkills: an array of strings  
- breakdown: an array of objects each with { skill, assignedPoints, maxPoints, reasoning }  
- calculations: a detailed string containing the full calculation and reasoning.  
- "learningResources": {
    "skillName": {
      "basic": [{"title": string, "url": string, "description": string}],
      "intermediate": [{"title": string, "url": string, "description": string}],
      "advanced": [{"title": string, "url": string, "description": string}]
    }

Do not include any markdown formatting in your output.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
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
    });

    let responseText = completion.choices[0].message.content;
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