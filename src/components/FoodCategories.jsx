import { Box, Container, Typography } from "@mui/material";

const categories = [
  {
    name: "Burgers",
    emoji: "🍔",
  },
  {
    name: "Pizza",
    emoji: "🍕",
  },
  {
    name: "Biryani",
    emoji: "🍛",
  },
  {
    name: "Chicken",
    emoji: "🍗",
  },
  {
    name: "Sandwiches",
    emoji: "🥪",
  },
  {
    name: "Drinks",
    emoji: "🥤",
  },
];

const FoodCategories = () => {
  return (
    <Box
      sx={{
        py: {
          xs: 7,
          md: 9,
        },
        backgroundColor: "#ffffff",
      }}
    >
      <Container maxWidth="xl">
        {/* Heading */}
        <Box
          sx={{
            textAlign: "center",
            mb: 5,
          }}
        >
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
            Explore our menu
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
            What are you craving?
          </Typography>

          <Typography
            sx={{
              color: "#777777",
              maxWidth: 550,
              mx: "auto",
              mt: 1.5,
              lineHeight: 1.7,
            }}
          >
            Choose your favorite category and discover something
            delicious.
          </Typography>
        </Box>

        {/* Categories */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(6, 1fr)",
            },
            gap: {
              xs: 2,
              md: 2.5,
            },
          }}
        >
          {categories.map((category) => (
            <Box
              key={category.name}
              sx={{
                border: "1px solid #eeeeee",
                borderRadius: 4,
                p: {
                  xs: 2,
                  md: 3,
                },
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backgroundColor: "#ffffff",

                "&:hover": {
                  transform: "translateY(-6px)",
                  borderColor: "#ff5a36",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
                },
              }}
            >
              <Box
                sx={{
                  width: {
                    xs: 60,
                    md: 75,
                  },
                  height: {
                    xs: 60,
                    md: 75,
                  },
                  borderRadius: "50%",
                  backgroundColor: "#fff3ee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: {
                    xs: "1.8rem",
                    md: "2.2rem",
                  },
                  mx: "auto",
                  mb: 1.5,
                }}
              >
                {category.emoji}
              </Box>

              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#333333",
                  fontSize: {
                    xs: "0.9rem",
                    md: "1rem",
                  },
                }}
              >
                {category.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FoodCategories;