import {
  GridRowModes,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import { randomId } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

export default function ConstraintsTableToolbar({ setConstraints, setRowModesModel }) {
  const handleAddRowClick = () => {
    // Reset all rows to View mode
    setRowModesModel((oldModel) => {
      const newModel = {};
      Object.keys(oldModel).forEach((id) => {
        newModel[id] = { mode: GridRowModes.View };
      });
      return newModel;
    });

    const id = randomId();
    setConstraints((constraints) => {
      // Generate a unique constraint name
      const newConstraints = [...constraints];
      let name = `con${newConstraints.length + 1}`;
      while (newConstraints.find((constraint) => constraint.name === name)) {
        name = 'con' + (parseInt(name.slice(10)) + 1).toString();
      }

      // Add the new constraint to the constraint list
      const newConstraint = {
        id,
        name,
        stateKey: '',
        stateType: '',
        subsystem: '',
        type: '',
        value: 0,
      };

      newConstraints.unshift(newConstraint);
      return newConstraints;
    });

    // Set the new constraint to Edit mode
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  }

  return (
    <GridToolbarContainer>
      <Button
        color="primary"
        size='small'
        startIcon={<AddIcon />}
        onClick={handleAddRowClick}
      >
        Add Constraint
      </Button>
      <GridToolbarColumnsButton color="primary"/>
      <GridToolbarFilterButton color="primary"/>
      <GridToolbarDensitySelector color="primary"/>
    </GridToolbarContainer>
  );
}