import ListGroup from 'react-bootstrap/ListGroup';

const inputTypes = {
  'Name': 'text',
  'Base Source': 'text',
  'Model Source': 'text',
  'Target Source': 'text',
  'Python Source': 'text',
  'Output Path': 'text',
  'Version': 'number',
  'Start JD': 'number',
  'Start Seconds': 'number',
  'End Seconds': 'number',
  'Primary Step Seconds': 'number',
  'Max Schedules': 'number',
  'Crop Ratio': 'number'
};

export default function ParameterGroup ({parameters, setParameters}) {
  return(
    Object.entries(parameters).map(([key, value]) => {
        return (
          <ListGroup.Item key={key} as='li' className='d-flex align-items-start'>
            {/* <div className="ms-2 me-auto">
              <strong>{key}:</strong>
              <br/>
              <div className='text-start'>{value}</div>
            </div> */}
            <form>
              <label htmlFor={key}><strong>{key}: </strong><br/></label>
              <input
                type={inputTypes[key]}
                id={key}
                name={key}
                value={value}
                onChange={(e) => setParameters[`set${key}`](e.target.value)}/>
            </form>
          </ListGroup.Item>
        )
      }
    )
  )
}