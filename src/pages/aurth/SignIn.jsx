
import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
const SignIn = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [firebaseError, setFirebaseError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setFirebaseError("");
    setLoading(true);

    try {
    const userCredential = await signInWithEmailAndPassword(
  auth,
  data.email,
  data.password
);

const user = userCredential.user;

// Get user's role from Firestore
const userRef = doc(db, "users", user.uid);
const userSnapshot = await getDoc(userRef);

if (userSnapshot.exists()) {
  const userData = userSnapshot.data();

  if (userData.role === "restaurant") {
    navigate("/restaurant-dashboard");
  } else {
    navigate("/");
  }
} else {
  navigate("/");
}
    } catch (error) {
      console.error(error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        setFirebaseError(
          "Invalid email or password."
        );
      } else if (error.code === "auth/invalid-email") {
        setFirebaseError(
          "Please enter a valid email address."
        );
      } else {
        setFirebaseError(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 76px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff8f5",
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            border: "1px solid #eeeeee",
          }}
        >
          {/* Heading */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              sx={{
                fontSize: "2rem",
                fontWeight: 800,
                color: "#171717",
              }}
            >
              Welcome Back
            </Typography>

            <Typography
              sx={{
                color: "#777777",
                mt: 1,
              }}
            >
              Sign in to continue ordering your favorite food.
            </Typography>
          </Box>

          {/* Firebase Error */}
          {firebaseError && (
            <Box
              sx={{
                backgroundColor: "#fff0ed",
                color: "#d84315",
                borderRadius: 2,
                px: 2,
                py: 1.5,
                mb: 2.5,
                fontSize: "0.9rem",
              }}
            >
              {firebaseError}
            </Box>
          )}

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Email */}
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              sx={{ mb: 2 }}
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value:
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message:
                    "Please enter a valid email address.",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            {/* Password */}
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              sx={{ mb: 3 }}
              {...register("password", {
                required: "Password is required.",
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        edge="end"
                      >
                        {showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.4,
                borderRadius: 2.5,
                backgroundColor: "#ff5a36",
                fontWeight: 700,
                textTransform: "none",
                fontSize: "1rem",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#e94d2c",
                  boxShadow: "none",
                },
              }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </Box>

          {/* Sign Up Link */}
          <Typography
            sx={{
              textAlign: "center",
              color: "#777777",
              mt: 3,
            }}
          >
            Don't have an account?{" "}
            <Box
              component={Link}
              to="/sign-up"
              sx={{
                color: "#ff5a36",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Create Account
            </Box>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignIn;

