const navCategories = [ 'Scenario', 'Tasks', 'System Model', 'Dependencies', 'Constraints', 'Simulate', 'Analyze' ];


export default function HSFNav({activeStep, setActiveStep}) {
  return (
    <nav>
      <img src='/SimLab_sqblk.png' alt="Sim Lab CalPoly Logo" />
      <h2>Categories</h2>
      {navCategories.map((category) => {
        if (activeStep === category) {
          return (
            <li key={category}>
              <button onClick={() => {setActiveStep(category)}}>{category}</button>
            </li>
          );
        } else {
          return (
            <li key={category}>
              <div onClick={() => {setActiveStep(category)}}>{category}</div>
            </li>
          );
        }
      })}
    </nav>
  );
}