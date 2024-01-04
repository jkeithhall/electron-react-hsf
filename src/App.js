import logo from './SimLab_sqblk.png';
// Need to move this to a file open event response...
//import data from './scenario.json';
import './App.css';
import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup';
import './App.scss'
import { useRef, useState } from 'react';
//import ListGroupItem from 'react-bootstrap/esm/ListGroupItem';

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
      <div className="grid-container">
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
  //let data = [{"Scenario Name": 1, name: "test"},{id: 2, name: "Eric"}];
  let data = {
        "Sources":{
          "Name": "Aeolus",
          "Base Source": "./samples/aeolus/",
          "Model Source": "DSAC_Static_Mod_Scripted.xml",
          "Target Source": "v2.2-300targets.xml",
          "Python Source": "pythonScripts/",
          "Output Path": "none",
          "Version": 1.0
        },
        "Simulation Parameters": {
            "Start JD": 2454680.0,
            "Start Seconds": 0.0,
            "End Seconds" : 60.0,
            "Primary Step Seconds": 30
          },
        "Scheduler Parameters": {
          "Max Schedules": 10,
          "Crop Ratio": 5,
        }
    }
  if (scanarioData !== null)
    data = JSON.parse(scanarioData)
  //console.log(data)

  const Visit = (obj) => {
    let i = 0
    const values = Object.values(obj)
    const keys = Object.keys(obj)
    console.log("keys")
    console.log(keys)
    return(
      keys.map((key) => {
        if (obj[key] && typeof obj[key] === "object"){
          return (
            <Accordion.Item eventKey={i++}>
              <Accordion.Header>{key}</Accordion.Header>
                <Accordion.Body>
                  <ListGroup as="ol" variant="flush">{Visit(obj[key])}</ListGroup>
                </Accordion.Body>
            </Accordion.Item>
          )
        } else {
          console.log(values[key])
          return (
            <ListGroup.Item as='li' className='d-flex align-items-start'>
              <div className="ms-2 me-auto">
                <div className="fw-bold text-start">
                  {key}:
                </div>
                  <div className='text-start'>{obj[key]}</div>
                </div>
            </ListGroup.Item>
          )
        }
        }
      )
    )
  }
  //const print = (val) => console.log(val)
  //visit(data, print)
  let scnElements = ''
  return (
      <Accordion flush>
        {Visit(data)}
      </Accordion>
  )
}
//export default App;

