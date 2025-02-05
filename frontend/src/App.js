// App.js
import React from 'react';
import ResumeUpload from './components/ResumeUpload';
import ThreeBackground from './components/ThreeBackground';
import './App.css';

function App() {
  return (
    <>
      <ThreeBackground />
      <div className="App">
        <header className="App-header">
          <h1>Resume Screener</h1>
        </header>
        <main>
          <ResumeUpload />
        </main>
      </div>
    </>
  );
}

export default App;
