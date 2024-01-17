const navCategories = [ 'Scenario', 'Tasks', 'System Model', 'Dependencies', 'Constraints', 'Simulate', 'Analyze' ];


export default function HSFNav({activeStep, setActiveStep}) {
  return (
    <nav>
      <img src='/SimLab_sqblk.png' alt="Sim Lab CalPoly Logo" />
      <h3>Categories</h3>
      {navCategories.map((category) => {
        const className = activeStep === category ? 'active' : '';
        return (
          <li key={category}>
            <button className={className} onClick={() => {setActiveStep(category)}}>{category}</button>
          </li>
        );
      })}
    </nav>
  );
}