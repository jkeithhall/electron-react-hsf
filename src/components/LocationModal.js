import { useState } from 'react';

import { MapContainer } from 'react-leaflet/MapContainer';
import { TileLayer } from 'react-leaflet/TileLayer';
import DraggableMarker from './DraggableMarker';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const DEFAULT_ZOOM = 5;

export default function LocationModal({ title, onCancel, onConfirm, selectedLocation, setSelectedLocation}) {
  const [markerLocation, setMarkerLocation] = useState([selectedLocation.lat, selectedLocation.lon]);


  const handleLatChange = (e) => {
    const { value } = e.target;
    setMarkerLocation([value, markerLocation[1]]);
  }

  const handleLonChange = (e) => {
    const { value } = e.target;
    setMarkerLocation([markerLocation[0], value]);
  }

  return (
    <div className="overlay">
      <Card sx={{ zIndex: 2, padding: '20px', width: '600px', height: 'auto', borderRadius: "5px"}}>
        <Typography variant="h4" my={2}>{title}</Typography>
        <div className="location-inputs">
          <TextField
            id="latitude"
            label="Latitude"
            type="number"
            value={markerLocation[0]}
            onChange={handleLatChange}
            color="info"
            size="small"
          />
          <TextField
            id="longitude"
            label="Longitude"
            type="number"
            value={markerLocation[1]}
            onChange={handleLonChange}
            color="info"
            size="small"
          />
        </div>
        <MapContainer center={markerLocation} zoom={DEFAULT_ZOOM} scrollWheelZoom={false} className="map-container" >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <DraggableMarker position={markerLocation} setPosition={setMarkerLocation} />
        </MapContainer>
        <div className='confirm-close-icons'>
          <Button color="info" variant="contained" onClick={onConfirm(markerLocation)} startIcon={<CheckIcon />}>
            Confirm
          </Button >
          <Button color="primary" variant="contained" onClick={onCancel} startIcon={<CloseIcon />}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}