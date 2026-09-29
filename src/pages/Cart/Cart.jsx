import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";


const Cart = () => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    subtotal,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 70px)",
          backgroundColor: "#fff8f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 6,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              textAlign: "center",
              p: { xs: 4, sm: 6 },
              borderRadius: 4,
              border: "1px solid #eeeeee",
            }}
          >
            <ShoppingCartOutlinedIcon
              sx={{
                fontSize: 70,
                color: "#ff5a36",
                mb: 2,
              }}
            />

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 1,
              }}
            >
              Your Cart is Empty
            </Typography>

            <Typography
              sx={{
                color: "#777",
                mb: 3,
              }}
            >
              Add some delicious food to your cart.
            </Typography>

            <Button
              component={Link}
              to="/foods"
              variant="contained"
              sx={{
                backgroundColor: "#ff5a36",
                borderRadius: 2.5,
                px: 4,
                py: 1.3,
                textTransform: "none",
                fontWeight: 700,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#e94d2c",
                  boxShadow: "none",
                },
              }}
            >
              Explore Foods
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 70px)",
        backgroundColor: "#fff8f5",
        py: { xs: 5, md: 7 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              color: "#ff5a36",
              fontWeight: 700,
              mb: 1,
            }}
          >
            Your Order
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: {
                xs: "2rem",
                sm: "2.5rem",
              },
            }}
          >
            Shopping Cart
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "2fr 1fr",
            },
            gap: 3,
          }}
        >
          {/* Cart Items */}
          <Paper
            elevation={0}
            sx={{  
            
  minHeight: { xs: 100, sm: 150 },
              borderRadius: 4,
              border: "1px solid #eeeeee",
              overflow: "hidden",
            }}
          >
            {cartItems.map((item, index) => (
              <Box sx={{minHeight:'100px'}} key={item.id}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    p: { xs: 2, sm: 3 },
                    alignItems: "center",
                  }}
                >
                  {/* Image */}
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                   sx={{
  width: { xs: 70, sm: 90 },
  height: { xs: 70, sm: 90 },
  borderRadius: 2,
  objectFit: "cover",
  flexShrink: 0,
}}
                  />

                  {/* Details */}
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: {
                          xs: "1rem",
                          sm: "1.15rem",
                        },
                        mb: 0.5,
                      }}
                    >
                      {item.name}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#ff5a36",
                        fontWeight: 700,
                        mb: 1.5,
                      }}
                    >
                      Rs. {item.price}
                    </Typography>

                    {/* Quantity */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <IconButton
                        onClick={() => decreaseQuantity(item.id)}
                        size="small"
                        sx={{
                          border: "1px solid #ddd",
                          width: 32,
                          height: 32,
                        }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>

                      <Typography
                        sx={{
                          minWidth: 25,
                          textAlign: "center",
                          fontWeight: 700,
                        }}
                      >
                        {item.quantity}
                      </Typography>

                      <IconButton
                        onClick={() => increaseQuantity(item.id)}
                        size="small"
                        sx={{
                          border: "1px solid #ddd",
                          width: 32,
                          height: 32,
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Total + Delete */}
                  <Box
                    sx={{
                      textAlign: "right",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 800,
                        color: "#171717",
                      }}
                    >
                      Rs. {item.price * item.quantity}
                    </Typography>

                    <IconButton
                      onClick={() => removeFromCart(item.id)}
                      sx={{
                        color: "#d32f2f",
                      }}
                    >
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </Box>
                </Box>

                {index < cartItems.length - 1 && <Divider />}
              </Box>
            ))}
          </Paper>

         {/* Summary */}
<Paper
  elevation={0}
  sx={{
    borderRadius: 4,
    border: "1px solid #eeeeee",
    p: 3,
    height: "fit-content",
  }}
>
  <Typography
    variant="h5"
    sx={{
      fontWeight: 800,
      mb: 3,
    }}
  >
    Order Summary
  </Typography>

  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      mb: 2,
    }}
  >
    <Typography color="text.secondary">
      Subtotal
    </Typography>

    <Typography fontWeight={700}>
      Rs. {subtotal}
    </Typography>
  </Box>

  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      mb: 2,
    }}
  >
    <Typography color="text.secondary">
      Delivery Fee
    </Typography>

    <Typography fontWeight={700}>
      Calculated at checkout
    </Typography>
  </Box>

  <Divider sx={{ my: 2 }} />

  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      mb: 3,
    }}
  >
    <Typography
      sx={{
        fontWeight: 800,
        fontSize: "1.1rem",
      }}
    >
      Total
    </Typography>

    <Typography
      sx={{
        fontWeight: 800,
        fontSize: "1.2rem",
        color: "#ff5a36",
      }}
    >
      Rs. {subtotal}
    </Typography>
  </Box>

  <Button
    fullWidth
    component={Link}
    to="/checkout"
    variant="contained"
    sx={{
      py: 1.4,
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
    Proceed to Checkout
  </Button>

  <Button
    fullWidth
    component={Link}
    to="/foods"
    variant="text"
    sx={{
      mt: 1,
      color: "#ff5a36",
      fontWeight: 700,
      textTransform: "none",
    }}
  >
    Continue Shopping
  </Button>
</Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Cart;
