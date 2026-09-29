import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const RestaurantProfile = () => {
  const [profile, setProfile] = useState({
    name: "Foodie Restaurant",
    phone: "",
    address: "Matta, Swat, Khyber Pakhtunkhwa, Pakistan",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const restaurantRef = doc(db, "restaurant", "1");
        const snapshot = await getDoc(restaurantRef);

        if (snapshot.exists()) {
          setProfile((prev) => ({
            ...prev,
            ...snapshot.data(),
          }));
        }
      } catch (error) {
        console.error("Error loading restaurant profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const restaurantRef = doc(db, "restaurant", "1");

      await updateDoc(restaurantRef, {
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        description: profile.description,
        image: profile.image,
      });

      setMessage("Restaurant profile updated successfully.");
    } catch (error) {
      console.error("Error updating restaurant profile:", error);
      setMessage("Failed to update restaurant profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "#ff5a36" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "80vh",
        backgroundColor: "#fafafa",
        py: { xs: 4, md: 6 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Box sx={{ maxWidth: 850, mx: "auto" }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#171717",
              mb: 1,
            }}
          >
            Restaurant Profile
          </Typography>

          <Typography
            sx={{
              color: "#777",
              fontSize: "1rem",
            }}
          >
            Manage your restaurant information.
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: 4,
            border: "1px solid #eeeeee",
            backgroundColor: "#fff",
          }}
        >
          {/* Profile Icon */}
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              backgroundColor: "#fff1ec",
              color: "#ff5a36",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <StorefrontRoundedIcon sx={{ fontSize: 36 }} />
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "grid",
              gap: 2.5,
            }}
          >
            <TextField
              fullWidth
              label="Restaurant Name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="03XX-XXXXXXX"
            />

            <TextField
              fullWidth
              label="Address"
              name="address"
              value={profile.address}
              onChange={handleChange}
              multiline
              rows={2}
              required
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={profile.description}
              onChange={handleChange}
              multiline
              rows={4}
              placeholder="Write something about your restaurant..."
            />

            <TextField
              fullWidth
              label="Restaurant Image URL"
              name="image"
              value={profile.image}
              onChange={handleChange}
              placeholder="https://example.com/restaurant.jpg"
            />

            {profile.image && (
              <Box
                component="img"
                src={profile.image}
                alt="Restaurant"
                sx={{
                  width: "100%",
                  maxWidth: 350,
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 3,
                  border: "1px solid #eeeeee",
                }}
              />
            )}

            {message && (
              <Typography
                sx={{
                  color: message.includes("successfully")
                    ? "#2e7d32"
                    : "#d32f2f",
                  fontWeight: 600,
                }}
              >
                {message}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveRoundedIcon />}
              disabled={saving}
              sx={{
                mt: 1,
                py: 1.4,
                borderRadius: 2.5,
                backgroundColor: "#ff5a36",
                fontWeight: 700,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#e94d2d",
                },
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default RestaurantProfile;