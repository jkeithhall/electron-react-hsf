import Typography from '@mui/material/Typography';

export default function InformationBar() {
  return (
    <aside>
      <ul>
        <li>
          <Typography variant="h4" my={2}>Information</Typography>
        </li>
        <li>
          <Typography variant="h5">Developed by:</Typography>
          <Typography variant="body1">Sim Master</Typography>
        </li>
      </ul>
    </aside>
  );
}