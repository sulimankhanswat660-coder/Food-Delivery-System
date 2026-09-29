

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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";

const SignUp = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [firebaseError, setFirebaseError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setFirebaseError("");
    setLoading(true);

    try {
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: data.name,
        email: data.email,
        role: "user",
        createdAt: serverTimestamp(),
      });

      navigate("/");
    } catch (error) {
      console.error(error);

      if (error.code === "auth/email-already-in-use") {
        setFirebaseError(
          "This email is already registered."
        );
      } else if (error.code === "auth/invalid-email") {
        setFirebaseError(
          "Please enter a valid email address."
        );
      } else if (error.code === "auth/weak-password") {
        setFirebaseError(
          "Password must be at least 6 characters."
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
              Create Account
            </Typography>

            <Typography
              sx={{
                color: "#777777",
                mt: 1,
              }}
            >
              Join FoodGo and order your favorite food.
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
            {/* Name */}
            <TextField
              fullWidth
              label="Full Name"
              sx={{ mb: 2 }}
              {...register("name", {
                required: "Full name is required.",
                minLength: {
                  value: 3,
                  message:
                    "Name must be at least 3 characters.",
                },
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

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
              sx={{ mb: 2 }}
              {...register("password", {
                required: "Password is required.",
                minLength: {
                  value: 6,
                  message:
                    "Password must be at least 6 characters.",
                },
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

            {/* Confirm Password */}
            <TextField
              fullWidth
              label="Confirm Password"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              sx={{ mb: 3 }}
              {...register("confirmPassword", {
                required:
                  "Please confirm your password.",
                validate: (value) =>
                  value === password ||
                  "Passwords do not match.",
              })}
              error={!!errors.confirmPassword}
              helperText={
                errors.confirmPassword?.message
              }
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
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
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </Button>
          </Box>

          {/* Sign In Link */}
          <Typography
            sx={{
              textAlign: "center",
              color: "#777777",
              mt: 3,
            }}
          >
            Already have an account?{" "}
            <Box
              component={Link}
              to="/sign-in"
              sx={{
                color: "#ff5a36",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Sign In
            </Box>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignUp;


