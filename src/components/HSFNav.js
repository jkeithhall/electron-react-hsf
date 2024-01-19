import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


const navCategories = [ 'Scenario', 'Tasks', 'System Model', 'Dependencies', 'Constraints', 'Simulate', 'Analyze' ];


export default function HSFNav({activeStep, setActiveStep}) {
  return (
    <nav>
      <img src='/SimLab_sqblk.png' alt="Sim Lab CalPoly Logo" />
      <Typography variant="h3" mb={3}>Categories</Typography>
      {navCategories.map((category) => {
        const variant = activeStep === category ? 'contained' : 'text';
        return (
          <li key={category}>
            <Button variant={variant} onClick={() => {setActiveStep(category)}}>{category}</Button>
          </li>
        );
      })}
    </nav>
  );
}