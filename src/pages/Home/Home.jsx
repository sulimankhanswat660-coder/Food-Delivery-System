import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";
import FoodCategories from "../../components/FoodCategories";
import PopularFoods from "../../components/PopularFoods";
import CTA from "../../components/CTA";

const Home = () => {
  return (
    <Box sx={{ backgroundColor: "#ffffff" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #fff8f5 0%, #ffffff 65%, #fff3ee 100%)",
          minHeight: {
            xs: "auto",
            md: "600px",
          },
          display: "flex",
          alignItems: "center",
          py: {
            xs: 7,
            md: 10,
          },
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1.05fr 0.95fr",
              },
              alignItems: "center",
              gap: {
                xs: 5,
                md: 4,
              },
            }}
          >
            {/* Left Content */}
            <Box>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  backgroundColor: "#fff0eb",
                  borderRadius: 10,
                  px: 2,
                  py: 0.8,
                  mb: 2.5,
                }}
              >
                <Typography
                  sx={{
                    color: "#ff5a36",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                  }}
                >
                  🍔 Delicious food, delivered fast
                </Typography>
              </Box>

              <Typography
                component="h1"
                sx={{
                  fontSize: {
                    xs: "2.7rem",
                    sm: "3.5rem",
                    md: "4.4rem",
                  },
                  lineHeight: 1.08,
                  fontWeight: 800,
                  letterSpacing: "-2px",
                  color: "#171717",
                  maxWidth: 650,
                }}
              >
                Your favorite food,
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    color: "#ff5a36",
                  }}
                >
                  delivered to you.
                </Box>
              </Typography>

              <Typography
                sx={{
                  color: "#666666",
                  fontSize: {
                    xs: "1rem",
                    md: "1.1rem",
                  },
                  lineHeight: 1.7,
                  maxWidth: 570,
                  mt: 3,
                }}
              >
                Discover delicious meals from your favorite place and
                enjoy a simple, fast and convenient food delivery
                experience.
              </Typography>

              {/* Search */}
              <Box
                sx={{
                  mt: 4,
                  maxWidth: 580,
                  display: "flex",
                  gap: 1,
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Search for food..."
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#999999" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    backgroundColor: "#ffffff",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                    },
                  }}
                />

                <Button
                  component={Link}
                  to="/foods"
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    minWidth: {
                      xs: "100%",
                      sm: 200,
                    },
                    borderRadius: 3,
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
                  Explore Food
                </Button>
              </Box>

              {/* Small Stats */}
              <Box
                sx={{
                  display: "flex",
                  gap: {
                    xs: 3,
                    sm: 5,
                  },
                  mt: 5,
                  flexWrap: "wrap",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: "1.5rem",
                      fontWeight: 800,
                      color: "#171717",
                    }}
                  >
                    50+
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "0.85rem",
                      color: "#777777",
                    }}
                  >
                    Delicious Foods
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: "1.5rem",
                      fontWeight: 800,
                      color: "#171717",
                    }}
                  >
                    4.8
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "0.85rem",
                      color: "#777777",
                    }}
                  >
                    Customer Rating
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: "1.5rem",
                      fontWeight: 800,
                      color: "#171717",
                    }}
                  >
                    30 min
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "0.85rem",
                      color: "#777777",
                    }}
                  >
                    Average Delivery
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Right Image */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80"
                alt="Delicious pizza"
                sx={{
                  width: "100%",
                  maxWidth: 520,
                  height: {
                    xs: 350,
                    sm: 450,
                    md: 500,
                  },
                  objectFit: "cover",
                  borderRadius: {
                    xs: 5,
                    md: 8,
                  },
                  boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
                }}
              />

              {/* Floating Rating Card */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: {
                    xs: -15,
                    md: 25,
                  },
                  left: {
                    xs: 10,
                    md: 0,
                  },
                  backgroundColor: "#ffffff",
                  borderRadius: 3,
                  px: 2.5,
                  py: 1.8,
                  boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "#777777",
                  }}
                >
                  Customer rating
                </Typography>

                <Typography
                  sx={{
                    fontSize: "1.15rem",
                    fontWeight: 800,
                    mt: 0.3,
                  }}
                >
                  ⭐ 4.8 / 5.0
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      <FoodCategories/>
      <PopularFoods/>
      <CTA/>
    </Box>
  );
};

export default Home;