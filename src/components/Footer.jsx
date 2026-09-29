import {
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import {
  Facebook,
  Instagram,
  Twitter,
  YouTube,
  LocationOn,
  Phone,
  Email,
} from "@mui/icons-material";

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Footer = () => {
  const { userData, loading } = useAuth();

  // Wait until Firebase finishes checking the logged-in user
  if (loading) {
    return null;
  }

  // Restaurant users should not see the footer
  if (userData?.role === "restaurant") {
    return null;
  }

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#171717",
        color: "#ffffff",
        mt: "auto",
      }}
    >
      <Container maxWidth="lg" sx={{pb:3,pt:7 }}>
        <Grid container spacing={10}>
          {/* Brand */}
          <Grid item 
          // xs={12} sm={6} md={4}
          size={{xs:12,sm:6,md:4}}

          >
            <Typography
              component={Link}
              to="/"
              sx={{
                textDecoration: "none",
                color: "#ffffff",
                fontSize: { xs: "1.7rem", md: "2rem" },
                fontWeight: 800,
                display: "inline-block",
                mb: 2,
              }}
            >
              Foodie
            </Typography>

            <Typography
              sx={{
                color: "#bdbdbd",
                lineHeight: 1.8,
                maxWidth: 330,
                fontSize: "0.95rem",
              }}
            >
              Delicious food delivered straight to your door. Order your
              favorite meals quickly and easily with Foodie.
            </Typography>

            {/* Social Icons */}
            <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
              <IconButton
                sx={{
                  color: "#ffffff",
                  backgroundColor: "#252525",
                  "&:hover": {
                    backgroundColor: "#ff5a36",
                  },
                }}
              >
                <Facebook />
              </IconButton>

              <IconButton
                sx={{
                  color: "#ffffff",
                  backgroundColor: "#252525",
                  "&:hover": {
                    backgroundColor: "#ff5a36",
                  },
                }}
              >
                <Instagram />
              </IconButton>

              <IconButton
                sx={{
                  color: "#ffffff",
                  backgroundColor: "#252525",
                  "&:hover": {
                    backgroundColor: "#ff5a36",
                  },
                }}
              >
                <Twitter />
              </IconButton>

              <IconButton
                sx={{
                  color: "#ffffff",
                  backgroundColor: "#252525",
                  "&:hover": {
                    backgroundColor: "#ff5a36",
                  },
                }}
              >
                <YouTube />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item 
          // xs={12} sm={6} md={2}
          size={{xs:6,sm:6,md:2}}
          >
            <Typography
              sx={{
                fontSize: "1.05rem",
                fontWeight: 700,
                mb: 2.5,
              }}
            >
              Quick Links
            </Typography>

            <Stack spacing={1.5}>
              <Typography
                component={Link}
                to="/"
                sx={{
                  color: "#bdbdbd",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                  "&:hover": {
                    color: "#ff5a36",
                  },
                }}
              >
                Home
              </Typography>

              <Typography
                component={Link}
                to="/foods"
                sx={{
                  color: "#bdbdbd",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                  "&:hover": {
                    color: "#ff5a36",
                  },
                }}
              >
                Foods
              </Typography>

              <Typography
                component={Link}
                to="/about"
                sx={{
                  color: "#bdbdbd",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                  "&:hover": {
                    color: "#ff5a36",
                  },
                }}
              >
                About
              </Typography>

              <Typography
                component={Link}
                to="/contact"
                sx={{
                  color: "#bdbdbd",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                  "&:hover": {
                    color: "#ff5a36",
                  },
                }}
              >
                Contact
              </Typography>
            </Stack>
          </Grid>

          {/* Customer */}
          <Grid item 
          // xs={12} sm={6} md={2}
                    size={{xs:6,sm:6,md:2}}

          >
            <Typography
              sx={{
                fontSize: "1.05rem",
                fontWeight: 700,
                mb: 2.5,
              }}
            >
              Customer
            </Typography>

            <Stack spacing={1.5}>
              <Typography
                component={Link}
                to="/orders"
                sx={{
                  color: "#bdbdbd",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                  "&:hover": {
                    color: "#ff5a36",
                  },
                }}
              >
                My Orders
              </Typography>

              <Typography
                component={Link}
                to="/cart"
                sx={{
                  color: "#bdbdbd",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                  "&:hover": {
                    color: "#ff5a36",
                  },
                }}
              >
                Cart
              </Typography>

              <Typography
                component={Link}
                to="/sign-in"
                sx={{
                  color: "#bdbdbd",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                  "&:hover": {
                    color: "#ff5a36",
                  },
                }}
              >
                Sign In
              </Typography>

              <Typography
                component={Link}
                to="/sign-up"
                sx={{
                  color: "#bdbdbd",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                  "&:hover": {
                    color: "#ff5a36",
                  },
                }}
              >
                Sign Up
              </Typography>
            </Stack>
          </Grid>

          {/* Contact */}
          <Grid item 
                    size={{xs:12,sm:6,md:4}}

          >
            <Typography
              sx={{
                fontSize: "1.05rem",
                fontWeight: 700,
                mb: 2.5,
              }}
            >
              Contact Us
            </Typography>

            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <LocationOn
                  sx={{
                    color: "#ff5a36",
                    mt: 0.2,
                  }}
                />

                <Typography
                  sx={{
                    color: "#bdbdbd",
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                  }}
                >
                  Matta, Swat, Khyber Pakhtunkhwa, Pakistan
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center">
                <Phone
                  sx={{
                    color: "#ff5a36",
                  }}
                />

                <Typography
                  sx={{
                    color: "#bdbdbd",
                    fontSize: "0.95rem",
                  }}
                >
                  +92 300 1234567
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center">
                <Email
                  sx={{
                    color: "#ff5a36",
                  }}
                />

                <Typography
                  sx={{
                    color: "#bdbdbd",
                    fontSize: "0.95rem",
                  }}
                >
                  support@foodie.com
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Divider
          sx={{
            borderColor: "#333333",
            my: 4,
          }}
        />

        {/* Bottom */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography
            sx={{
              color: "#888888",
              fontSize: "0.9rem",
            }}
          >
            © {new Date().getFullYear()} Foodie. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
