import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';
import ParameterGroup from './ParameterGroup';

export default function HSFCards({activeScenario, sources, simulationParameters, schedulerParameters, setStateMethods}) {
  return (
    <div className='work-space'>
      <Accordion flush>
        <Accordion.Item eventKey={0}>
          <Accordion.Header>Sources</Accordion.Header>
            <Accordion.Body>
              <ListGroup as="ol" variant="flush">
                <ParameterGroup parameters={sources} setParameters={setStateMethods}/>
              </ListGroup>
            </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey={1}>
          <Accordion.Header>Simulation Parameters</Accordion.Header>
            <Accordion.Body>
              <ListGroup as="ol" variant="flush">
                <ParameterGroup parameters={simulationParameters} setParameters={setStateMethods}/>
              </ListGroup>
            </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey={2}>
          <Accordion.Header>Scheduler Parameters</Accordion.Header>
            <Accordion.Body>
              <ListGroup as="ol" variant="flush">
                <ParameterGroup parameters={schedulerParameters} setParameters={setStateMethods}/>
              </ListGroup>
            </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}