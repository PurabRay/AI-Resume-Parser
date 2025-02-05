// App.js
import React from 'react';
import ResumeUpload from './components/ResumeUpload';
import ThreeBackground from './components/ThreeBackground'; // Import new component
import './App.css';

function App() {
  return (
    <div className="App" style={{ position: 'relative', minHeight: '100vh' }}>
      <ThreeBackground />
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
