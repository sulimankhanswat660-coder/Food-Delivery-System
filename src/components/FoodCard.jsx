import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();

  const handleBuyNow = () => {
    addToCart(food);
  };

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid #eeeeee",
        boxShadow: "none",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
        },
      }}
    >
      <CardMedia
        component="img"
        height="220"
        image={food.image}
        alt={food.name}
        sx={{
          objectFit: "cover",
        }}
      />

      <CardContent
        sx={{
          p: 2.5,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          {food.name}
        </Typography>

        <Typography
          sx={{
            color: "#777",
            fontSize: "0.9rem",
            lineHeight: 1.6,
            mb: 2,
          }}
        >
          {food.description}
        </Typography>

        <Box sx={{ mt: "auto" }}>
          <Typography
            sx={{
              color: "#ff5a36",
              fontSize: "1.2rem",
              fontWeight: 800,
              mb: 2,
            }}
          >
            Rs. {food.price}
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
            }}
          >
            <Button
              component={Link}
              to={`/foods/${food.id}`}
              fullWidth
              variant="outlined"
              sx={{
                height: 44,
                borderRadius: 2.5,
                borderColor: "#ff5a36",
                color: "#ff5a36",
                fontWeight: 700,
                textTransform: "none",
                whiteSpace: "nowrap",
                "&:hover": {
                  borderColor: "#ff5a36",
                  backgroundColor: "#fff5f1",
                },
              }}
            >
              View Food
            </Button>

            <Button
              fullWidth
              variant="contained"
              onClick={handleBuyNow}
              sx={{
                height: 44,
                borderRadius: 2.5,
                backgroundColor: "#ff5a36",
                color: "#ffffff",
                fontWeight: 700,
                textTransform: "none",
                whiteSpace: "nowrap",
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
      </CardContent>
    </Card>
  );
};

export default FoodCard;