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