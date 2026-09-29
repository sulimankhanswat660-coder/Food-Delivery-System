import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;

      const newPosition = {
        latitude: lat,
        longitude: lng,
      };

      setPosition(newPosition);
    },
  });

  return position ? (
    <Marker
      position={[
        position.latitude,
        position.longitude,
      ]}
    />
  ) : null;
};

const MapController = ({ position }) => {
  const map = useMap();

  if (position) {
    map.setView(
      [position.latitude, position.longitude],
      14
    );
  }

  return null;
};

const LocationPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLocationChange = (newPosition) => {
    setPosition(newPosition);
    setError("");

    onLocationSelect(newPosition);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(
        "Location is not supported by your browser."
      );
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (location) => {
        const newPosition = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setPosition(newPosition);

        onLocationSelect(newPosition);

        setLoading(false);
      },
      () => {
        setError(
          "Unable to detect your location. Please select your location manually on the map."
        );

        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Typography
        sx={{
          fontWeight: 700,
          mb: 1,
        }}
      >
        Select Delivery Location
      </Typography>

      <Typography
        sx={{
          color: "#777",
          fontSize: "0.9rem",
          mb: 2,
        }}
      >
        Click anywhere on the map or use your current
        location.
      </Typography>

      <Button
        type="button"
        variant="outlined"
        startIcon={<LocationOnIcon />}
        onClick={getCurrentLocation}
        disabled={loading}
        sx={{
          mb: 2,
          borderColor: "#ff5a36",
          color: "#ff5a36",
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 700,
          "&:hover": {
            borderColor: "#ff5a36",
            backgroundColor: "#fff5f1",
          },
        }}
      >
        {loading
          ? "Detecting Location..."
          : "Use My Current Location"}
      </Button>

      {error && (
        <Alert
          severity="warning"
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          overflow: "hidden",
          borderRadius: 3,
          border: "1px solid #eeeeee",
        }}
      >
        <MapContainer
          center={[34.5906, 72.0086]}
          zoom={12}
          style={{
            height: "350px",
            width: "100%",
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationMarker
            position={position}
            setPosition={handleLocationChange}
          />

          <MapController position={position} />
        </MapContainer>
      </Paper>

      {position && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: "#fff5f1",
            borderRadius: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 700,
            }}
          >
            Selected Location
          </Typography>

          <Typography
            sx={{
              color: "#777",
              fontSize: "0.85rem",
              mt: 0.5,
            }}
          >
            Latitude: {position.latitude.toFixed(6)}
          </Typography>

          <Typography
            sx={{
              color: "#777",
              fontSize: "0.85rem",
            }}
          >
            Longitude: {position.longitude.toFixed(6)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LocationPicker;