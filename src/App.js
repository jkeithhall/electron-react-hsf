import logo from './SimLab_sqblk.png';
// Need to move this to a file open event response...
import data from './scenario.json';
import './App.css';
import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'
import './App.scss'
import { useRef, useState } from 'react';

class Scenario {
  constructor(scanarioData) {
    this.scenarioName = scanarioData;
  }
}
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
export default function App() {
  const [activeScenario, setActiveScenario] = useState(null);

  const showFile = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => { 
      const text = (e.target.result)
      setActiveScenario(text)
    };
    reader.readAsText(e.target.files[0])
  }
  return (
    <div className="App">
      <div class="grid-container">
        <header className="App-header">
          <h1>HSF Builder - PICASSO</h1>
          <input type="file" onChange={(e) => showFile(e)} />
        </header>
          <HSFNav />

          <div class="work-space">
              <HSFCard scanarioData={activeScenario}/>
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

function HSFCard({scanarioData}) {
  let data = "";
  if (scanarioData !== null)
    data = JSON.parse(scanarioData)
  console.log(data)
  return (
      <Accordion flush>
        <Accordion.Item eventKey='0'>
          <Accordion.Header>HSF Scenario</Accordion.Header>
            <Accordion.Body>
              <ul>
                <li> <strong>Name: </strong> {data.scenarioName}</li>
                <li> Version: {data.version}</li>
              </ul>

            </Accordion.Body>
          </Accordion.Item>
      </Accordion>
  )
}
//export default App;

