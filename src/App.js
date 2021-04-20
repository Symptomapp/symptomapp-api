import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          This will be the <code>backend</code> for <strong>Symptomapp</strong> project.
        </p>
         <a
          className="App-link"
          href="https://github.com/Symptomapp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i class="fab fa-github"> </i> Symptomapp on Github
        </a>
      </header>
    </div>
  );
}

export default App;
