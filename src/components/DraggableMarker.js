import { useRef, useMemo } from "react";
import { Marker } from "react-leaflet/Marker";

export default function DraggableMarker({ position, setPosition }) {
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          let { lat, lng } = marker.getLatLng();
          // Only use 4 decimal places of precision
          lat = Number(lat.toFixed(4));
          lng = Number(lng.toFixed(4));
          setPosition([lat, lng]);
        }
      },
    }),
    [setPosition],
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    ></Marker>
  );
}
