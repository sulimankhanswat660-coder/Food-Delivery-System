import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import DeliveryDiningRoundedIcon from "@mui/icons-material/DeliveryDiningRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        minHeight: "calc(100vh - 70px)",
      }}
    >
      {/* ================= HERO ================= */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #fff8f5 0%, #ffffff 55%, #fff1ec 100%)",
          py: { xs: 6, sm: 8, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">
            {/* Left */}
            <Grid
              item
              // xs={12} md={6}
              size={{ xs: 12, md: 6 }}
            >
              <Box sx={{ maxWidth: 570 }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1.8,
                    py: 0.8,
                    borderRadius: 10,
                    backgroundColor: "#fff0eb",
                    color: "#ff5a36",
                    mb: 2.5,
                  }}
                >
                  <RestaurantMenuRoundedIcon sx={{ fontSize: 20 }} />

                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: 700,
                    }}
                  >
                    About Foodie
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    fontWeight: 800,
                    color: "#171717",
                    fontSize: {
                      xs: "2.6rem",
                      sm: "3.4rem",
                      md: "4.2rem",
                    },
                    lineHeight: 1.08,
                    letterSpacing: "-1.5px",
                    mb: 3,
                  }}
                >
                  Food that makes
                  <Box
                    component="span"
                    sx={{
                      display: "block",
                      color: "#ff5a36",
                    }}
                  >
                    you happy.
                  </Box>
                </Typography>

                <Typography
                  sx={{
                    color: "#666666",
                    fontSize: {
                      xs: "1rem",
                      md: "1.1rem",
                    },
                    lineHeight: 1.8,
                    maxWidth: 520,
                    mb: 4,
                  }}
                >
                  Foodie is a simple and convenient food delivery platform
                  designed to make ordering your favorite meals easier, faster,
                  and more enjoyable.
                </Typography>

                <Button
                  component={Link}
                  to="/foods"
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    backgroundColor: "#ff5a36",
                    color: "#ffffff",
                    px: 3,
                    py: 1.5,
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "1rem",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "#e94d2c",
                      boxShadow: "none",
                    },
                  }}
                >
                  Explore Foods
                </Button>
              </Box>
            </Grid>

            {/* Right */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: "relative",
                  maxWidth: 560,
                  mx: "auto",
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85"
                  alt="Delicious food"
                  sx={{
                    width: "100%",
                    height: {
                      xs: 320,
                      sm: 400,
                      md: 470,
                    },
                    objectFit: "cover",
                    borderRadius: 5,
                    display: "block",
                  }}
                />

                {/* Floating Card */}
                <Paper
                  elevation={0}
                  sx={{
                    position: "absolute",
                    bottom: { xs: 15, sm: 25 },
                    left: { xs: 15, sm: 25 },
                    px: 2.5,
                    py: 2,
                    borderRadius: 3,
                    backgroundColor: "rgba(255,255,255,0.96)",
                    border: "1px solid rgba(255,255,255,0.8)",
                    boxShadow: "0 12px 35px rgba(0,0,0,0.10)",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "1.05rem",
                    }}
                  >
                    🍽️ Fresh & Delicious
                  </Typography>

                  <Typography
                    sx={{
                      color: "#777777",
                      fontSize: "0.85rem",
                      mt: 0.4,
                    }}
                  >
                    Delivered to your door
                  </Typography>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ================= STATS ================= */}
      <Box
        sx={{
          backgroundColor: "#171717",
          py: { xs: 4, md: 5 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: {
                      xs: "1.8rem",
                      md: "2.2rem",
                    },
                  }}
                >
                  50+
                </Typography>

                <Typography
                  sx={{
                    color: "#aaaaaa",
                    mt: 0.5,
                  }}
                >
                  Delicious Foods
                </Typography>
              </Box>
            </Grid>

            <Grid item size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: {
                      xs: "1.8rem",
                      md: "2.2rem",
                    },
                  }}
                >
                  4.8
                </Typography>

                <Typography
                  sx={{
                    color: "#aaaaaa",
                    mt: 0.5,
                  }}
                >
                  Customer Rating
                </Typography>
              </Box>
            </Grid>

            <Grid
              item
              // xs={6} md={3}
              size={{ xs: 6, md: 3 }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: {
                      xs: "1.8rem",
                      md: "2.2rem",
                    },
                  }}
                >
                  30
                </Typography>

                <Typography
                  sx={{
                    color: "#aaaaaa",
                    mt: 0.5,
                  }}
                >
                  Min. Delivery
                </Typography>
              </Box>
            </Grid>

            <Grid item size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: {
                      xs: "1.8rem",
                      md: "2.2rem",
                    },
                  }}
                >
                  100%
                </Typography>

                <Typography
                  sx={{
                    color: "#aaaaaa",
                    mt: 0.5,
                  }}
                >
                  Customer Focused
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ================= OUR STORY ================= */}
      <Box
        sx={{
          py: { xs: 7, md: 10 },
          backgroundColor: "#ffffff",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">
            {/* Image */}
            <Grid
              item
              // xs={12} md={6}
              size={{ xs: 12, md: 6 }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1000&q=85"
                alt="Food preparation"
                sx={{
                  width: "100%",
                  height: {
                    xs: 300,
                    sm: 400,
                    md: 470,
                  },
                  objectFit: "cover",
                  borderRadius: 5,
                }}
              />
            </Grid>

            {/* Content */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <Typography
                sx={{
                  color: "#ff5a36",
                  fontWeight: 700,
                  mb: 1.5,
                }}
              >
                Our Story
              </Typography>

              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: {
                    xs: "2rem",
                    md: "2.8rem",
                  },
                  lineHeight: 1.15,
                  mb: 2.5,
                }}
              >
                We believe great food should be easy to enjoy.
              </Typography>

              <Typography
                sx={{
                  color: "#666666",
                  lineHeight: 1.8,
                  mb: 2,
                }}
              >
                Foodie was created with one simple idea: make food ordering easy
                for everyone. Instead of making the ordering process
                complicated, we focus on a clean and simple experience.
              </Typography>

              <Typography
                sx={{
                  color: "#666666",
                  lineHeight: 1.8,
                  mb: 3,
                }}
              >
                Browse delicious meals, choose what you want, select your
                delivery location, and place your order with just a few clicks.
              </Typography>

              <Stack spacing={1.5}>
                {[
                  "Simple and easy food ordering",
                  "Fresh and delicious meals",
                  "Convenient delivery experience",
                ].map((text) => (
                  <Box
                    key={text}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.2,
                    }}
                  >
                    <CheckCircleRoundedIcon
                      sx={{
                        color: "#ff5a36",
                        fontSize: 22,
                      }}
                    />

                    <Typography
                      sx={{
                        color: "#333333",
                        fontWeight: 600,
                      }}
                    >
                      {text}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ================= VALUES ================= */}
      <Box
        sx={{
          backgroundColor: "#fff8f5",
          py: { xs: 7, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              textAlign: "center",
              maxWidth: 650,
              mx: "auto",
              mb: 6,
            }}
          >
            <Typography
              sx={{
                color: "#ff5a36",
                fontWeight: 700,
                mb: 1,
              }}
            >
              What We Care About
            </Typography>

            <Typography
              sx={{
                fontWeight: 800,
                fontSize: {
                  xs: "2rem",
                  md: "2.8rem",
                },
                mb: 2,
              }}
            >
              Made for food lovers
            </Typography>

            <Typography
              sx={{
                color: "#777777",
                lineHeight: 1.8,
              }}
            >
              Everything we do is focused on making your food ordering
              experience better.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Card 1 */}
            <Grid item size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  height: "100%",
                  borderRadius: 4,
                  border: "1px solid #eeeeee",
                  backgroundColor: "#ffffff",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    borderColor: "#ff5a36",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 58,
                    height: 58,
                    borderRadius: 3,
                    backgroundColor: "#fff0eb",
                    color: "#ff5a36",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <RestaurantMenuRoundedIcon sx={{ fontSize: 30 }} />
                </Box>

                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.25rem",
                    mb: 1,
                  }}
                >
                  Great Food
                </Typography>

                <Typography
                  sx={{
                    color: "#777777",
                    lineHeight: 1.7,
                  }}
                >
                  We want every meal you order to be something you genuinely
                  enjoy.
                </Typography>
              </Paper>
            </Grid>

            {/* Card 2 */}
            <Grid item size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  height: "100%",
                  borderRadius: 4,
                  border: "1px solid #eeeeee",
                  backgroundColor: "#ffffff",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    borderColor: "#ff5a36",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 58,
                    height: 58,
                    borderRadius: 3,
                    backgroundColor: "#fff0eb",
                    color: "#ff5a36",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <DeliveryDiningRoundedIcon sx={{ fontSize: 30 }} />
                </Box>

                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.25rem",
                    mb: 1,
                  }}
                >
                  Easy Delivery
                </Typography>

                <Typography
                  sx={{
                    color: "#777777",
                    lineHeight: 1.7,
                  }}
                >
                  We make it easy to get your favorite food delivered to your
                  selected location.
                </Typography>
              </Paper>
            </Grid>

            {/* Card 3 */}
            <Grid item size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  height: "100%",
                  borderRadius: 4,
                  border: "1px solid #eeeeee",
                  backgroundColor: "#ffffff",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    borderColor: "#ff5a36",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 58,
                    height: 58,
                    borderRadius: 3,
                    backgroundColor: "#fff0eb",
                    color: "#ff5a36",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <FavoriteRoundedIcon sx={{ fontSize: 30 }} />
                </Box>

                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.25rem",
                    mb: 1,
                  }}
                >
                  Happy Customers
                </Typography>

                <Typography
                  sx={{
                    color: "#777777",
                    lineHeight: 1.7,
                  }}
                >
                  A smooth and enjoyable experience is at the heart of
                  everything we build.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ================= CTA ================= */}
      <Box
        sx={{
          py: { xs: 7, md: 9 },
          backgroundColor: "#ffffff",
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, #ff5a36 0%, #e94d2c 100%)",
              borderRadius: 5,
              p: { xs: 4, sm: 6, md: 7 },
              textAlign: "center",
              color: "#ffffff",
            }}
          >
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: {
                  xs: "2rem",
                  md: "2.7rem",
                },
                mb: 1.5,
              }}
            >
              Ready to order?
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.7,
                maxWidth: 550,
                mx: "auto",
                mb: 3.5,
              }}
            >
              Discover delicious food and enjoy a simple ordering experience
              with Foodie.
            </Typography>

            <Button
              component={Link}
              to="/foods"
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                backgroundColor: "#ffffff",
                color: "#ff5a36",
                borderRadius: 2.5,
                px: 3,
                py: 1.4,
                textTransform: "none",
                fontWeight: 800,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#fff5f2",
                  boxShadow: "none",
                },
              }}
            >
              Browse Foods
            </Button>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
