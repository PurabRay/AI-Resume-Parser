# AI Resume Parser

A full-stack web application that parses resumes using the **Llama 3.1 API** and generates ATS (Applicant Tracking System) scores against a given job description. Built with React, Node.js, and MongoDB.

## What it does

Upload a resume and paste a job description — the app parses the resume, scores it for ATS compatibility, explains the score, identifies skill gaps, and links to learning resources at beginner, intermediate, and advanced levels.

## Features

- **Resume parsing** — extracts structured data (skills, experience, education, projects) from uploaded resumes using Llama 3.1
- **ATS scoring** — scores the resume against a job description and provides reasoning for the score
- **Skill gap analysis** — identifies missing skills required by the job description
- **Learning resource recommendations** — links to resources for each missing skill at three proficiency levels (beginner / intermediate / advanced)
- **MongoDB storage** — parsed resume data is persisted for history and comparison

## Tech Stack

**Frontend:** React, CSS  
**Backend:** Node.js, Express  
**AI:** Llama 3.1 API  
**Database:** MongoDB  

## Project Structure

```
AI-Resume-Parser/
├── frontend/       # React app
└── backend/        # Node.js + Express API
```

## Getting Started

```bash
# Backend
cd backend
npm install
# Add your Llama API key and MongoDB URI to .env
npm start

# Frontend
cd frontend
npm install
npm start
```

**.env (backend):**
```
LLAMA_API_KEY=your_key
MONGODB_URI=your_mongodb_uri
PORT=5000
```

## How it works

1. User uploads a resume (PDF or text)
2. Backend sends resume content to Llama 3.1 for structured extraction
3. User inputs a job description
4. Llama compares the parsed resume against the JD and generates an ATS score with explanation
5. Missing skills are identified and paired with curated learning links
6. Results stored in MongoDB for the user's session
