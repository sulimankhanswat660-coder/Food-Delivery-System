import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Grid,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

import { db } from "../../firebase/firebase";
import FoodCard from "../../components/FoodCard";
import { useCart } from "../../context/CartContext";

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [food, setFood] = useState(null);
  const [relatedFoods, setRelatedFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        setLoading(true);

        // Get current food
        const foodRef = doc(db, "foods", id);
        const foodSnapshot = await getDoc(foodRef);

        if (!foodSnapshot.exists()) {
          setFood(null);
          return;
        }

        const currentFood = {
          id: foodSnapshot.id,
          ...foodSnapshot.data(),
        };

        setFood(currentFood);

        // Get all foods
        const foodsSnapshot = await getDocs(collection(db, "foods"));

        const allFoods = foodsSnapshot.docs.map((foodDoc) => ({
          id: foodDoc.id,
          ...foodDoc.data(),
        }));

        // Remove current food
        const otherFoods = allFoods.filter(
          (item) => item.id !== currentFood.id,
        );

        // Show maximum 4 related foods
        setRelatedFoods(otherFoods.slice(0, 4));
      } catch (error) {
        console.error("Error fetching food:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 70px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "#ff5a36" }} />
      </Box>
    );
  }

  if (!food) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 70px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" fontWeight={700}>
            Food not found
          </Typography>

          <Button
            onClick={() => navigate("/foods")}
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "#ff5a36",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#e94d2c",
              },
            }}
          >
            Back to Foods
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 70px)",
        backgroundColor: "#fff8f5",
        py: { xs: 5, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        {/* Food Details */}
        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            borderRadius: 4,
            border: "1px solid #eeeeee",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
            }}
          >
            {/* Image */}
            <Box
              component="img"
              src={food.image}
              alt={food.name}
              sx={{
                width: "100%",
                height: {
                  xs: 300,
                  sm: 400,
                  md: 500,
                },
                objectFit: "cover",
              }}
            />

            {/* Details */}
            <Box
              sx={{
                p: {
                  xs: 3,
                  sm: 4,
                  md: 6,
                },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  color: "#ff5a36",
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                {food.category}
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: {
                    xs: "2rem",
                    sm: "2.5rem",
                    md: "3rem",
                  },
                  mb: 2,
                }}
              >
                {food.name}
              </Typography>

              <Typography
                sx={{
                  color: "#777",
                  lineHeight: 1.8,
                  mb: 3,
                }}
              >
                {food.description}
              </Typography>

              <Typography
                sx={{
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  color: "#ff5a36",
                  mb: 4,
                }}
              >
                Rs. {food.price}
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  addToCart(food);
                  // navigate("/cart");
                }}
                sx={{
                  width: "fit-content",
                  px: 4,
                  py: 1.3,
                  borderRadius: 2.5,
                  backgroundColor: "#ff5a36",
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#e94d2c",
                    boxShadow: "none",
                  },
                }}
              >
                Buy Now
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Related Foods */}
        {relatedFoods.length > 0 && (
          <Box sx={{ mt: 8 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                sx={{
                  color: "#ff5a36",
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                More Delicious Choices
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  fontSize: {
                    xs: "1.8rem",
                    sm: "2.2rem",
                  },
                }}
              >
                You May Also Like
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {relatedFoods.map((relatedFood) => (
                <Grid
                  key={relatedFood.id}
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                    lg: 3,
                  }}
                >
                  <FoodCard food={relatedFood} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default FoodDetails;
