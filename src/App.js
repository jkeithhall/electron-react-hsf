import logo from './SimLab_sqblk.png';
import './App.css';
import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'
import './App.scss'

function HSFNav() {
  return (
    <nav>
      <img src={logo} alt="logo" />
      <p>Catagories</p>
      <li><button id="scenarioNav">Scenario</button></li>
      <li>Tasks</li>
      <li>System Model</li>
      <li>Dependencies</li>
      <li>Constraints</li>
      <li>Simulate</li>
      <li>Analyze</li>
    </nav>
  );
}

function HSFCard() {
  return (
      <Accordion flush>
        <Accordion.Item eventKey='0'>
          <Accordion.Header>HSF Scenario</Accordion.Header>
            <Accordion.Body>
              Some HSF Scenario Information Here!
              <Button>A New Button
              </Button>
            </Accordion.Body>
          </Accordion.Item>
      </Accordion>
  )
}
export default function App() {
  return (
    <div className="App">
      <div class="grid-container">
        <header className="App-header">
          <h1>HSF Builder - PICASSO</h1>
        </header>
          <HSFNav />

          <div class="work-space">
              <HSFCard />
          </div>
          <aside>
              <ul>
                <li>
                  <p><strong>Info Here</strong></p>
                </li>
                <li>
                  <p><strong>Developed by:</strong></p>
                  <p>Sim Master</p>
                </li>
              </ul>
            </aside>
            <footer>
              <p> Copyright 2023 - Poly Sim</p>
            </footer> 
      </div>
    </div>
  );
}

//export default App;

