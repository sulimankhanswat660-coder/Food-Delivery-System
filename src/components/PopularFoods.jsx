import { Box, Container, Typography, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FoodCard from "./FoodCard";
import { Link } from "react-router-dom";
import { useFood } from "../context/FoodContext";

const PopularFoods = () => {
  const { foods, loading } = useFood();

  // Show only the first 4 foods on Home page
  const popularFoods = foods.slice(0, 4);

  return (
    <Box
      sx={{
        py: {
          xs: 7,
          md: 9,
        },
        backgroundColor: "#fafafa",
      }}
    >
      <Container maxWidth="xl">
        {/* Heading */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              md: "flex-end",
            },
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: 2,
            mb: 5,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#ff5a36",
                fontSize: "0.9rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
                mb: 1,
              }}
            >
              Customer favorites
            </Typography>

            <Typography
              component="h2"
              sx={{
                fontSize: {
                  xs: "2rem",
                  md: "2.7rem",
                },
                fontWeight: 800,
                color: "#171717",
                letterSpacing: "-1px",
              }}
            >
              Popular Foods
            </Typography>

            <Typography
              sx={{
                color: "#777777",
                mt: 1,
              }}
            >
              Try some of our most loved dishes.
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/foods"
            endIcon={<ArrowForwardIcon />}
            sx={{
              color: "#ff5a36",
              fontWeight: 700,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#fff3ee",
              },
            }}
          >
            View All Foods
          </Button>
        </Box>

        {/* Food Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {loading ? (
            <Typography sx={{ color: "#777777" }}>Loading foods...</Typography>
          ) : popularFoods.length > 0 ? (
            popularFoods.map((food) => <FoodCard key={food.id} food={food} />)
          ) : (
            <Typography sx={{ color: "#777777" }}>
              No foods available.
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default PopularFoods;
