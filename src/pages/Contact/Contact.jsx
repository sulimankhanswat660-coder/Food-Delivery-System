import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
const Contact = () => {
  const { currentUser, loading: authLoading } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
const onSubmit = async (data) => {
  if (!currentUser) {
    navigate("/sign-in");
    return;
  }

  try {
    await addDoc(collection(db, "contactMessages"), {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      read: false,
      createdAt: serverTimestamp(),
    });

    alert("Your message has been sent successfully!");

    reset();
  } catch (error) {
    console.error("Error sending message:", error);
    alert("Failed to send your message. Please try again.");
  }
};
  return (
    <Box
      sx={{
        backgroundColor: "#fff8f5",
        minHeight: "calc(100vh - 70px)",
      }}
    >
      {/* ================= HERO ================= */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #fff8f5 0%, #ffffff 60%, #fff0eb 100%)",
          py: { xs: 6, sm: 8, md: 9 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              textAlign: "center",
              maxWidth: 750,
              mx: "auto",
            }}
          >
            <Typography
              sx={{
                color: "#ff5a36",
                fontWeight: 700,
                mb: 1.5,
              }}
            >
              Contact Foodie
            </Typography>

            <Typography
              sx={{
                fontWeight: 800,
                fontSize: {
                  xs: "2.5rem",
                  sm: "3.2rem",
                  md: "4rem",
                },
                lineHeight: 1.1,
                letterSpacing: "-1px",
                mb: 2.5,
              }}
            >
              We'd love to
              <Box
                component="span"
                sx={{
                  color: "#ff5a36",
                  display: "block",
                }}
              >
                hear from you.
              </Box>
            </Typography>

            <Typography
              sx={{
                color: "#666666",
                lineHeight: 1.8,
                fontSize: {
                  xs: "1rem",
                  md: "1.1rem",
                },
              }}
            >
              Have a question, suggestion, or need help with your order? Send us
              a message and we'll be happy to help.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ================= CONTACT CONTENT ================= */}
      <Box
        sx={{
          py: { xs: 6, md: 9 },
          backgroundColor: "#ffffff",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* ================= LEFT SIDE ================= */}
            <Grid
              item
              // xs={12} md={5}
              size={{ xs: 12, md: 5 }}
            >
              <Typography
                sx={{
                  color: "#ff5a36",
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Get In Touch
              </Typography>

              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: {
                    xs: "2rem",
                    md: "2.6rem",
                  },
                  lineHeight: 1.2,
                  mb: 2,
                }}
              >
                We're here to help.
              </Typography>

              <Typography
                sx={{
                  color: "#777777",
                  lineHeight: 1.8,
                  mb: 4,
                }}
              >
                Whether you have a question about your order or want to share
                your feedback, feel free to contact us.
              </Typography>

              {/* Location */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  mb: 2,
                  borderRadius: 3,
                  border: "1px solid #eeeeee",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 2.5,
                    backgroundColor: "#fff0eb",
                    color: "#ff5a36",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <LocationOnRoundedIcon />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      mb: 0.3,
                    }}
                  >
                    Our Location
                  </Typography>

                  <Typography
                    sx={{
                      color: "#777777",
                      fontSize: "0.9rem",
                      lineHeight: 1.5,
                    }}
                  >
                    Matta, Swat, Khyber Pakhtunkhwa, Pakistan
                  </Typography>
                </Box>
              </Paper>

              {/* Phone */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  mb: 2,
                  borderRadius: 3,
                  border: "1px solid #eeeeee",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 2.5,
                    backgroundColor: "#fff0eb",
                    color: "#ff5a36",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <PhoneRoundedIcon />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      mb: 0.3,
                    }}
                  >
                    Phone
                  </Typography>

                  <Typography
                    sx={{
                      color: "#777777",
                      fontSize: "0.9rem",
                    }}
                  >
                    +92 300 1234567
                  </Typography>
                </Box>
              </Paper>

              {/* Email */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  mb: 2,
                  borderRadius: 3,
                  border: "1px solid #eeeeee",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 2.5,
                    backgroundColor: "#fff0eb",
                    color: "#ff5a36",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <EmailRoundedIcon />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      mb: 0.3,
                    }}
                  >
                    Email
                  </Typography>

                  <Typography
                    sx={{
                      color: "#777777",
                      fontSize: "0.9rem",
                    }}
                  >
                    support@foodie.com
                  </Typography>
                </Box>
              </Paper>

              {/* Hours */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: "1px solid #eeeeee",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 2.5,
                    backgroundColor: "#fff0eb",
                    color: "#ff5a36",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <AccessTimeRoundedIcon />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      mb: 0.3,
                    }}
                  >
                    Opening Hours
                  </Typography>

                  <Typography
                    sx={{
                      color: "#777777",
                      fontSize: "0.9rem",
                    }}
                  >
                    Monday – Sunday · 10:00 AM – 10:00 PM
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* ================= FORM ================= */}
            <Grid
              item
              // xs={12} md={7}
              size={{ xs: 12, md: 7 }}
            >
            <Paper
  elevation={0}
  sx={{
    p: { xs: 3, sm: 4, md: 5 },
    borderRadius: 4,
    border: "1px solid #eeeeee",
    backgroundColor: "#fff",
  }}
>
  {authLoading ? (
    <Box
      sx={{
        minHeight: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        sx={{
          color: "#777777",
        }}
      >
        Checking your login status...
      </Typography>
    </Box>
  ) : !currentUser ? (
    <Box
      sx={{
        minHeight: 300,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <Typography
        sx={{
          fontWeight: 800,
          fontSize: "1.6rem",
          mb: 1,
        }}
      >
        Please Login First
      </Typography>

      <Typography
        sx={{
          color: "#777777",
          lineHeight: 1.7,
          maxWidth: 450,
          mb: 3,
        }}
      >
        You need to be logged in before you can send us a message.
      </Typography>

      <Button
        component={Link}
        to="/sign-in"
        variant="contained"
        sx={{
          px: 3.5,
          py: 1.3,
          borderRadius: 2.5,
          backgroundColor: "#ff5a36",
          textTransform: "none",
          fontWeight: 700,
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#e94d2c",
            boxShadow: "none",
          },
        }}
      >
        Login Now
      </Button>
    </Box>
  ) : (
    <>
      <Typography
        sx={{
          fontWeight: 800,
          fontSize: "1.6rem",
          mb: 1,
        }}
      >
        Send us a message
      </Typography>

      <Typography
        sx={{
          color: "#777777",
          mb: 3,
        }}
      >
        Fill out the form below and we'll get back to you.
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Grid container spacing={2.5}>
          {/* Name */}
          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Your Name"
              {...register("name", {
                required: "Name is required",
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>

          {/* Email */}
          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>

          {/* Subject */}
          <Grid item size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Subject"
              {...register("subject", {
                required: "Subject is required",
              })}
              error={!!errors.subject}
              helperText={errors.subject?.message}
            />
          </Grid>

          {/* Message */}
          <Grid item size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Your Message"
              multiline
              rows={6}
              {...register("message", {
                required: "Message is required",
                minLength: {
                  value: 10,
                  message:
                    "Message must be at least 10 characters",
                },
              })}
              error={!!errors.message}
              helperText={errors.message?.message}
            />
          </Grid>

          {/* Submit */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              endIcon={<SendRoundedIcon />}
              sx={{
                mt: 1,
                px: 3.5,
                py: 1.4,
                borderRadius: 2.5,
                backgroundColor: "#ff5a36",
                textTransform: "none",
                fontWeight: 700,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#e94d2c",
                  boxShadow: "none",
                },
              }}
            >
              Send Message
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  )}
</Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ================= BOTTOM CTA ================= */}
      {/* <Box
        sx={{
          backgroundColor: "#fff8f5",
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: {
                  xs: "1.8rem",
                  md: "2.4rem",
                },
                mb: 1,
              }}
            >
              Hungry already?
            </Typography>

            <Typography
              sx={{
                color: "#777777",
                mb: 3,
              }}
            >
              Skip the waiting and order your favorite food today.
            </Typography>

            <Button
              component={Link}
              to="/foods"
              variant="contained"
              sx={{
                backgroundColor: "#ff5a36",
                borderRadius: 2.5,
                px: 3.5,
                py: 1.4,
                textTransform: "none",
                fontWeight: 700,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#e94d2c",
                  boxShadow: "none",
                },
              }}
            >
              Order Food
            </Button>
          </Box>
        </Container>
      </Box> */}
    </Box>
  );
};

export default Contact;
