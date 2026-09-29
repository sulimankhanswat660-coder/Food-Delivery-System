import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/firebase";

const Profile = () => {
  const { currentUser } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
          const data = snapshot.data();

          setProfile({
            name: data.name || "",
            email: data.email || currentUser.email || "",
            phone: data.phone || "",
            address: data.address || "",
          });
        } else {
          setProfile({
            name: "",
            email: currentUser.email || "",
            phone: "",
            address: "",
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

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

    if (!currentUser) return;

    try {
      setSaving(true);
      setMessage("");

      const userRef = doc(db, "users", currentUser.uid);

      await updateDoc(userRef, {
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
      });

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (!currentUser) return;

    setPasswordMessage("");

    if (!currentPassword) {
      setPasswordMessage("Please enter your current password.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      return;
    }

    try {
      setPasswordLoading(true);

      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );

      await reauthenticateWithCredential(
        currentUser,
        credential
      );

      await updatePassword(currentUser, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordMessage("Password changed successfully.");
    } catch (error) {
      console.error("Error changing password:", error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password"
      ) {
        setPasswordMessage("Current password is incorrect.");
      } else if (error.code === "auth/weak-password") {
        setPasswordMessage("New password is too weak.");
      } else if (
        error.code === "auth/requires-recent-login"
      ) {
        setPasswordMessage(
          "Please sign in again before changing your password."
        );
      } else {
        setPasswordMessage(
          "Failed to change password. Please try again."
        );
      }
    } finally {
      setPasswordLoading(false);
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
      <Box sx={{ maxWidth: 750, mx: "auto" }}>
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
            My Profile
          </Typography>

          <Typography
            sx={{
              color: "#777",
              fontSize: "1rem",
            }}
          >
            Manage your personal information.
          </Typography>
        </Box>

        {/* Personal Information */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: 4,
            border: "1px solid #eeeeee",
            backgroundColor: "#fff",
          }}
        >
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
            <PersonRoundedIcon sx={{ fontSize: 36 }} />
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
              label="Full Name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Email"
              value={profile.email}
              disabled
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
              rows={3}
              placeholder="Enter your delivery address"
            />

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

        {/* Change Password */}
        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: { xs: 2.5, sm: 4 },
            borderRadius: 4,
            border: "1px solid #eeeeee",
            backgroundColor: "#fff",
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: "#fff1ec",
              color: "#ff5a36",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <LockRoundedIcon sx={{ fontSize: 30 }} />
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              mb: 1,
            }}
          >
            Change Password
          </Typography>

          <Typography
            sx={{
              color: "#777",
              mb: 3,
            }}
          >
            Update your account password securely.
          </Typography>

          <Box
            component="form"
            onSubmit={handleChangePassword}
            sx={{
              display: "grid",
              gap: 2.5,
            }}
          >
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              value={currentPassword}
              onChange={(event) =>
                setCurrentPassword(event.target.value)
              }
              required
            />

            <TextField
              fullWidth
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(event.target.value)
              }
              helperText="Password must be at least 6 characters."
              required
            />

            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              required
            />

            {passwordMessage && (
              <Typography
                sx={{
                  color: passwordMessage.includes("successfully")
                    ? "#2e7d32"
                    : "#d32f2f",
                  fontWeight: 600,
                }}
              >
                {passwordMessage}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={passwordLoading}
              sx={{
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
              {passwordLoading
                ? "Changing Password..."
                : "Change Password"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Profile;