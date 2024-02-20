import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My Website</h1>
        <p>Your go-to destination for all things awesome!</p>
      </header>
      <section className="Features">
        <h2>Features</h2>
        <ul>
          <li>Feature 1</li>
          <li>Feature 2</li>
          <li>Feature 3</li>
        </ul>
      </section>
      <section className="CTA">
        <h2>Get Started</h2>
        <p>Sign up now and join the fun!</p>
        <button>Sign Up</button>
      </section>
      <footer className="Footer">
        <p>&copy; 2024 My Website. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
