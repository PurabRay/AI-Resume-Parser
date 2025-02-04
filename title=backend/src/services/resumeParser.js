{
  role: "system",
  content: "Extract key information from this resume in JSON format. The JSON output should include the keys personalInfo, skills, workExperience, education, certifications, competitiveProfiles, and projects. Ensure that 'projects' is an array of objects where each object contains the keys: title, description, and technologies (an array of strings). Use empty arrays or empty strings if no data is available. Do not include any markdown formatting in your output."
}, 