module.exports = { evaluateATS };

// New function for Detective role evaluation – exactly the same prompt structure
async function evaluateATSD(parsedData, role) {
  try {
    const prompt = `
      You are an ATS (Applicant Tracking System) evaluator. Analyze the following resume for a ${role} position:
      ${JSON.stringify(parsedData)}

      Do not include any markdown formatting in your output.

      Evaluate the resume and provide:
      1. A score out of 100
      2. A breakdown of points for each required skill (showing reasoning and points assigned)
      3. A list of missing but required skills
      4. For each missing skill, provide learning resources categorized as basic, intermediate, and advanced (2-3 resources with URLs for each level)

      Format your response as a JSON object with this structure:
      {
        "atsScore": number,
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

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
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
    // Remove any markdown formatting that might be present
    responseText = responseText.replace(/```json\s?/, '').replace(/```/g, '').trim();

    const atsEvaluation = JSON.parse(responseText);
    return atsEvaluation;
  } catch (err) {
    console.error("Error evaluating ATS for Detective:", err);
    throw new Error(`Error evaluating ATS for Detective: ${err.message}`);
  }
}

// New function for Lawyer role evaluation – exactly the same prompt structure
async function evaluateATSL(parsedData, role) {
  try {
    const prompt = `
      You are an ATS (Applicant Tracking System) evaluator. Analyze the following resume for a ${role} position:
      ${JSON.stringify(parsedData)}

      Do not include any markdown formatting in your output.

      Evaluate the resume and provide:
      1. A score out of 100
      2. A breakdown of points for each required skill (showing reasoning and points assigned)
      3. A list of missing but required skills
      4. For each missing skill, provide learning resources categorized as basic, intermediate, and advanced (2-3 resources with URLs for each level)

      Format your response as a JSON object with this structure:
      {
        "atsScore": number,
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

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
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
    // Remove any markdown formatting that might be present
    responseText = responseText.replace(/```json\s?/, '').replace(/```/g, '').trim();

    const atsEvaluation = JSON.parse(responseText);
    return atsEvaluation;
  } catch (err) {
    console.error("Error evaluating ATS for Lawyer:", err);
    throw new Error(`Error evaluating ATS for Lawyer: ${err.message}`);
  }
}

// Dispatcher function: select appropriate evaluation function based on role
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