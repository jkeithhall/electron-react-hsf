import ListGroup from 'react-bootstrap/ListGroup';

const inputTypes = {
  sourceName: { displayName: 'Source', formType: 'text'},
  baseSource: { displayName: 'Base Source', formType: 'text'},
  modelSource: { displayName: 'Model Source', formType: 'text'},
  targetSource: { displayName: 'Target Source', formType: 'text'},
  pythonSource: { displayName: 'Python Source', formType: 'text'},
  outputPath: { displayName: 'Output Path', formType: 'text'},
  version: { displayName: 'Version', formType: 'number'},
  startJD: { displayName: 'Start JD', formType: 'number'},
  startSeconds: { displayName: 'Start Seconds', formType: 'number'},
  endSeconds: { displayName: 'End Seconds', formType: 'number'},
  primaryStepSeconds: { displayName: 'Primary Step Seconds', formType: 'number'},
  maxSchedules: { displayName: 'Max Schedules', formType: 'number'},
  cropRatio: { displayName: 'Crop Ratio', formType: 'number'},
};

export default function ParameterGroup ({parameters, setParameters}) {
  return(
    Object.entries(parameters).map(([key, value]) => {
      const setMethodName = 'set' + key[0].toUpperCase() + key.slice(1);

      return (
        <ListGroup.Item key={key} as='li' className='d-flex align-items-start'>
          <form>
            <label htmlFor={key}><strong>{inputTypes[key].displayName}:&nbsp;</strong><br/></label>
            <input
              type={inputTypes[key].formType}
              id={key}
              name={key}
              value={value}
              onChange={(e) => setParameters[setMethodName](e.target.value)}/>
          </form>
        </ListGroup.Item>
      )
    })
  )
}