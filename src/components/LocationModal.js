import { useState } from 'react';

import { MapContainer } from 'react-leaflet/MapContainer';
import { TileLayer } from 'react-leaflet/TileLayer';
import DraggableMarker from './DraggableMarker';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const DEFAULT_ZOOM = 5;
const mapOptions = {
  Alidade_Smooth_Dark: {
    url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
    minZoom: 0,
    maxZoom: 20,
    attribution: '&copy; Stadia Maps &copy; OpenMapTiles &copy; OpenStreetMap contributors',
  },
  Alidade_Smooth: {
    url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
    minZoom: 0,
    maxZoom: 20,
    attribution: '&copy; Stadia Maps &copy; OpenMapTiles &copy; OpenStreetMap contributors',
  },
  Alidade_Satellite: {
    url: 'https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg',
    minZoom: 0,
    maxZoom: 20,
    attribution: '&copy; CNES, Distribution Airbus DS &copy; Airbus DS &copy; PlanetObserver (Contains Copernicus Data) | &copy; Stadia Maps &copy; OpenMapTiles &copy; OpenStreetMap contributors',
  },
  Outdoors: {
    url: 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png',
    minZoom: 0,
    maxZoom: 20,
    attribution: '&copy; Stadia Maps &copy; OpenMapTile &copy; OpenStreetMap contributors',
  },
  Stamen_Toner_Lite: {
    url: 'https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png',
    minZoom: 0,
    maxZoom: 20,
    attribution: '&copy; Stadia Maps &copy; Stamen Design &copy; OpenMapTiles &copy; OpenStreetMap contributors',
  },
  Stamen_Terrain: {
    url: 'https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png',
    minZoom: 0,
    maxZoom: 20,
    attribution: '&copy; Stadia Maps &copy; Stamen Design &copy; OpenMapTiles &copy; OpenStreetMap contributors',
  },
}

export default function LocationModal({ title, onCancel, onConfirm, selectedLocation, setSelectedLocation}) {
  const [selectedMap, setSelectedMap] = useState('Alidade_Smooth_Dark');
  const [markerLocation, setMarkerLocation] = useState([selectedLocation.lat, selectedLocation.lon]);


  const handleLatChange = (e) => {
    const { value } = e.target;
    setMarkerLocation([value, markerLocation[1]]);
  }

  const handleLonChange = (e) => {
    const { value } = e.target;
    setMarkerLocation([markerLocation[0], value]);
  }

  const formatMapName = (name) => {
    return name.replace(/_/g, ' ');
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
            color="primary"
            size="small"
          />
          <TextField
            id="longitude"
            label="Longitude"
            type="number"
            value={markerLocation[1]}
            onChange={handleLonChange}
            color="primary"
            size="small"
          />
          <TextField
            id="map-tiles"
            select
            align="left"
            label="Map Tiles"
            value={selectedMap}
            onChange={(e) => setSelectedMap(e.target.value)}
            color="primary"
            size="small"
            width="200px"
          >
            {Object.keys(mapOptions).map((option) => (
              <MenuItem key={option} value={option}>
                {formatMapName(option)}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <MapContainer center={markerLocation} zoom={DEFAULT_ZOOM} scrollWheelZoom={false} className="map-container" >
          <TileLayer
            attribution={mapOptions[selectedMap].attribution}
            url={mapOptions[selectedMap].url}
            minZoom={mapOptions[selectedMap].minZoom}
            maxZoom={mapOptions[selectedMap].maxZoom}
          />
          <DraggableMarker position={markerLocation} setPosition={setMarkerLocation} />
        </MapContainer>
        <div className='confirm-close-icons'>
          <Button variant="contained" onClick={onConfirm(markerLocation)} startIcon={<CheckIcon />}>
            Confirm
          </Button >
          <Button color="light" variant="contained" onClick={onCancel} startIcon={<CloseIcon />}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}