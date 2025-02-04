import React from 'react';
import ResumeUpload from './components/ResumeUpload';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Resume Screener</h1>
      </header>
      <main>
        <ResumeUpload />
      </main>
    </div>
  );
}

export default App;
