import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

export default function HSFCard({activeScenario, stateVariables, setStateMethods}) {
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
  if (activeScenario !== null)
    data = JSON.parse(activeScenario)
  //console.log(data)

  const Visit = (obj) => {
    let i = 0
    const values = Object.values(obj)
    const keys = Object.keys(obj)
    console.log({keys});
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

  return (
    <div className='work-space'>
      <Accordion flush>
        {Visit(data)}
      </Accordion>
    </div>
  )
}