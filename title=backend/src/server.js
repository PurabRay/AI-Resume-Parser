// Resume upload endpoint
app.post('/api/resume/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Parse the resume using our existing service
    const parsedResume = await parseResume(req.file.path);
    
    // Check for ATS role from form-data; it is assumed to be passed as "atsRole"
    let atsEvaluation = null;
    if (req.body.atsRole) {
      atsEvaluation = await evaluateATS(parsedResume.parsedData, req.body.atsRole);
      // Persist the ATS evaluation in the resume document
      parsedResume.atsEvaluation = atsEvaluation;
      await parsedResume.save();
    }

    res.json({ 
      message: 'Resume uploaded successfully',
      parsedData: parsedResume,
      atsEvaluation: atsEvaluation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); 