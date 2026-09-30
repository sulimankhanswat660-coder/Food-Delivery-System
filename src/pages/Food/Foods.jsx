
import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Button,
} from "@mui/material";
import FoodCard from "../../components/FoodCard";

import { useFoods } from "../../hooks/useFoods";

const categories = [
  "All",
  "Burgers",
  "Pizza",
  "Biryani",
  "Chicken",
  "Sandwiches",
  "Drinks",
];

const Foods = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useFoods(selectedCategory);

  // Combine all loaded pages
  const foods =
    data?.pages.flatMap((page) => page.foods) || [];

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 70px)",
        backgroundColor: "#ffffff",
        py: { xs: 5, md: 7 },
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{
            textAlign: "center",
            mb: 4,
          }}
        >
          <Typography
            sx={{
              color: "#ff5a36",
              fontWeight: 700,
              mb: 1,
            }}
          >
            Our Menu
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "#171717",
              fontSize: {
                xs: "2rem",
                sm: "2.5rem",
                md: "3rem",
              },
            }}
          >
            Explore Our Foods
          </Typography>

          <Typography
            sx={{
              color: "#777777",
              mt: 1,
              maxWidth: 600,
              mx: "auto",
            }}
          >
            Choose from our delicious selection and order your favorite meal.
          </Typography>
        </Box>

        {/* Categories */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1.5,
            flexWrap: "wrap",
            mb: 5,
          }}
        >
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={
                selectedCategory === category
                  ? "contained"
                  : "outlined"
              }
              sx={{
                borderRadius: 3,
                px: 2.5,
                py: 1,
                textTransform: "none",
                fontWeight: 600,

                ...(selectedCategory === category
                  ? {
                      backgroundColor: "#ff5a36",
                      color: "#ffffff",
                      "&:hover": {
                        backgroundColor: "#e94c2b",
                      },
                    }
                  : {
                      borderColor: "#dddddd",
                      color: "#555555",
                      "&:hover": {
                        borderColor: "#ff5a36",
                        color: "#ff5a36",
                        backgroundColor: "#fff5f1",
                      },
                    }),
              }}
            >
              {category}
            </Button>
          ))}
        </Box>

        {/* Initial Loading */}
        {isLoading ? (
          <Box
            sx={{
              minHeight: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress sx={{ color: "#ff5a36" }} />
          </Box>
        ) : foods.length === 0 ? (
          <Box
            sx={{
              minHeight: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                No Foods Found
              </Typography>

              <Typography color="text.secondary">
                No foods are available in the {selectedCategory} category.
              </Typography>
            </Box>
          </Box>
        ) : (
          <>
            {/* Food Cards */}
            <Grid container spacing={3}>
              {foods.map((food) => (
                <Grid
                  key={food.id}
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                    lg: 3,
                  }}
                >
                  <FoodCard food={food} />
                </Grid>
              ))}
            </Grid>

            {/* Load More */}
            {hasNextPage && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 5,
                }}
              >
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  variant="contained"
                  sx={{
                    backgroundColor: "#ff5a36",
                    color: "#ffffff",
                    px: 4,
                    py: 1.3,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    minWidth: 150,

                    "&:hover": {
                      backgroundColor: "#e94c2b",
                    },
                  }}
                >
                  {isFetchingNextPage ? (
                    <CircularProgress
                      size={24}
                      sx={{ color: "#ffffff" }}
                    />
                  ) : (
                    "Load More"
                  )}
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Foods;



