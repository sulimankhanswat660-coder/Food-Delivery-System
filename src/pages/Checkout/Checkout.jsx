import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/firebase";
import restaurantLocation from "../../data/restaurantLocation";
import LocationPicker from "../../components/LocationPicker";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// Delivery fee based on distance
const calculateDeliveryFee = (distance) => {
  if (distance <= 7) {
    return 100;
  }

  if (distance <= 14) {
    return 200;
  }

  if (distance <= 20) {
    return 300;
  }

  return null;
};

const Checkout = () => {
  const navigate = useNavigate();

  const { cartItems, subtotal, clearCart } = useCart();
  const { currentUser, userData } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const [customerLocation, setCustomerLocation] = useState(null);

  const [locationError, setLocationError] = useState("");

  const [orderError, setOrderError] = useState("");

  const [placingOrder, setPlacingOrder] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: userData?.name || "",
      phone: userData?.phone || "",
      address: userData?.address || "",
    },
  });

  // Calculate delivery fee from selected distance
  const deliveryFee = customerLocation
    ? calculateDeliveryFee(customerLocation.distance)
    : null;

  const total = subtotal + (deliveryFee ?? 0);

  const handleLocationSelect = (location) => {
    setLocationError("");
    setOrderError("");

    const distance = calculateDistance(
      restaurantLocation.latitude,
      restaurantLocation.longitude,
      location.latitude,
      location.longitude,
    );

    const selectedLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
      distance,
    };

    setCustomerLocation(selectedLocation);
    const fee = calculateDeliveryFee(distance);
  };

  const handleOrderSubmit = async (data) => {
    setLocationError("");
    setOrderError("");

    // Location validation
    if (!customerLocation) {
      setLocationError("Please select your delivery location on the map.");
      return;
    }

    // 20 km validation
    if (customerLocation.distance > 20) {
      setLocationError(
        `Sorry, delivery is only available within 20 km. Your distance is ${customerLocation.distance.toFixed(
          2,
        )} km.`,
      );
      return;
    }

    // Calculate final delivery fee
    const finalDeliveryFee = calculateDeliveryFee(customerLocation.distance);

    if (finalDeliveryFee === null) {
      setLocationError("Sorry, delivery is only available within 20 km.");
      return;
    }

    if (!currentUser) {
      setOrderError("Please sign in before placing your order.");
      return;
    }

    try {
      setPlacingOrder(true);

      const finalTotal = subtotal + finalDeliveryFee;

      const orderData = {
        userId: currentUser.uid,

        customer: {
          name: data.name,
          phone: data.phone,
          address: data.address,
        },

        items: cartItems.map((item) => ({
          foodId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),

        restaurant: {
          id: 1,
          name: restaurantLocation.name,
          address: restaurantLocation.address,
        },

        deliveryLocation: {
          latitude: customerLocation.latitude,
          longitude: customerLocation.longitude,
          distance: Number(customerLocation.distance.toFixed(2)),
        },

        paymentMethod,

        subtotal,

        deliveryFee: finalDeliveryFee,

        total: finalTotal,

        status: "Pending",

        createdAt: serverTimestamp(),
      };

      const orderRef = await addDoc(collection(db, "orders"), orderData);

      console.log("Order created successfully:", orderRef.id);

      clearCart();

      // Send order ID and total to confirmation page
      navigate("/order-confirmation", {
        state: {
          orderId: orderRef.id,
          orderTotal: finalTotal,
        },
      });
    } catch (error) {
      console.error("Error creating order:", error);

      setOrderError(
        "Something went wrong while placing your order. Please try again.",
      );
    } finally {
      setPlacingOrder(false);
    }
  };

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
              p: 5,
              textAlign: "center",
              borderRadius: 4,
              border: "1px solid #eeeeee",
            }}
          >
            <Typography
              variant="h5"
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
              Add some delicious food before checking out.
            </Typography>

            <Button
              variant="contained"
              onClick={() => navigate("/foods")}
              sx={{
                backgroundColor: "#ff5a36",
                borderRadius: 2.5,
                px: 4,
                py: 1.2,
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
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              color: "#ff5a36",
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            Checkout
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
            Complete Your Order
          </Typography>

          <Typography
            sx={{
              color: "#777",
              mt: 1,
            }}
          >
            Enter your delivery information and place your order.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* LEFT SIDE */}
          <Grid
            size={{
              xs: 12,
              md: 7,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 4 },
                borderRadius: 4,
                border: "1px solid #eeeeee",
              }}
            >
              <form
                id="checkout-form"
                onSubmit={handleSubmit(handleOrderSubmit)}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    mb: 3,
                  }}
                >
                  Delivery Information
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2.5,
                  }}
                >
                  {/* NAME */}
                  <TextField
                    fullWidth
                    label="Full Name"
                    {...register("name", {
                      required: "Full name is required.",
                      minLength: {
                        value: 3,
                        message: "Name must be at least 3 characters.",
                      },
                    })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />

                  {/* PHONE */}
                  <TextField
                    fullWidth
                    label="Phone Number"
                    placeholder="03XX XXXXXXX"
                    {...register("phone", {
                      required: "Phone number is required.",
                      pattern: {
                        value: /^03[0-9]{9}$/,
                        message: "Enter a valid Pakistani phone number.",
                      },
                    })}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />

                  {/* ADDRESS */}
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="Delivery Address"
                    placeholder="Enter your complete delivery address"
                    {...register("address", {
                      required: "Delivery address is required.",
                      minLength: {
                        value: 10,
                        message: "Please enter a complete address.",
                      },
                    })}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />

                  {/* LOCATION */}
                  <LocationPicker onLocationSelect={handleLocationSelect} />

                  {/* DISTANCE */}
                  {customerLocation && (
                    <Alert
                      severity={
                        customerLocation.distance <= 20 ? "success" : "error"
                      }
                      sx={{
                        borderRadius: 2,
                      }}
                    >
                      {customerLocation.distance <= 20 ? (
                        <>
                          Delivery location selected successfully.
                          <br />
                          Distance from restaurant:{" "}
                          <strong>
                            {customerLocation.distance.toFixed(2)} km
                          </strong>
                          <br />
                          Delivery Fee: <strong>Rs. {deliveryFee}</strong>
                          <br />
                          Delivery is available.
                        </>
                      ) : (
                        <>
                          Delivery location selected.
                          <br />
                          Distance from restaurant:{" "}
                          <strong>
                            {customerLocation.distance.toFixed(2)} km
                          </strong>
                          <br />
                          Delivery is only available within 20 km.
                        </>
                      )}
                    </Alert>
                  )}

                  {locationError && (
                    <Alert
                      severity="error"
                      sx={{
                        borderRadius: 2,
                      }}
                    >
                      {locationError}
                    </Alert>
                  )}

                  {orderError && (
                    <Alert
                      severity="error"
                      sx={{
                        borderRadius: 2,
                      }}
                    >
                      {orderError}
                    </Alert>
                  )}
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* PAYMENT */}
                <FormControl>
                  <FormLabel
                    sx={{
                      color: "#171717",
                      fontWeight: 700,
                      mb: 1,
                      "&.Mui-focused": {
                        color: "#171717",
                      },
                    }}
                  >
                    Payment Method
                  </FormLabel>

                  <RadioGroup
                    value={paymentMethod}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                  >
                    <FormControlLabel
                      value="Cash on Delivery"
                      control={
                        <Radio
                          sx={{
                            color: "#ff5a36",
                            "&.Mui-checked": {
                              color: "#ff5a36",
                            },
                          }}
                        />
                      }
                      label="Cash on Delivery"
                    />

                    <FormControlLabel
                      value="Online Payment"
                      control={
                        <Radio
                          sx={{
                            color: "#ff5a36",
                            "&.Mui-checked": {
                              color: "#ff5a36",
                            },
                          }}
                        />
                      }
                      label="Online Payment"
                    />
                  </RadioGroup>
                </FormControl>

                {/* MOBILE BUTTON */}
                <Box
                  sx={{
                    display: {
                      xs: "block",
                      md: "none",
                    },
                    mt: 4,
                  }}
                >
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={
                      placingOrder ||
                      (customerLocation && customerLocation.distance > 20)
                    }
                    sx={{
                      height: 50,
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
                    {placingOrder ? "Placing Order..." : "Place Order"}
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>

          {/* RIGHT SIDE */}
          <Grid
            size={{
              xs: 12,
              md: 5,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 4,
                border: "1px solid #eeeeee",
                position: {
                  md: "sticky",
                },
                top: 90,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                }}
              >
                Your Order
              </Typography>

              {/* FOOD ITEMS */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {cartItems.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      minWidth: 0,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.name}
                      sx={{
                        width: 65,
                        height: 65,
                        borderRadius: 2,
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />

                    <Box
                      sx={{
                        flexGrow: 1,
                        minWidth: 0,
                        overflow: "hidden",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.name}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#777",
                          fontSize: "0.85rem",
                          mt: 0.3,
                        }}
                      >
                        Rs. {item.price} × {item.quantity}
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        flexShrink: 0,
                      }}
                    >
                      Rs. {item.price * item.quantity}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* SUBTOTAL */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography sx={{ color: "#777" }}>Subtotal</Typography>

                <Typography fontWeight={700}>Rs. {subtotal}</Typography>
              </Box>

              {/* DELIVERY FEE */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography sx={{ color: "#777" }}>Delivery Fee</Typography>

                <Typography fontWeight={700}>
                  {!customerLocation
                    ? "Select location"
                    : deliveryFee === null
                      ? "Unavailable"
                      : `Rs. ${deliveryFee}`}
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* TOTAL */}
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
                    color: "#ff5a36",
                    fontWeight: 800,
                    fontSize: "1.2rem",
                  }}
                >
                  {!customerLocation
                    ? "Select location"
                    : deliveryFee === null
                      ? "Unavailable"
                      : `Rs. ${total}`}
                </Typography>
              </Box>

              {/* DESKTOP BUTTON */}
              <Button
                fullWidth
                type="submit"
                form="checkout-form"
                variant="contained"
                disabled={
                  placingOrder ||
                  (customerLocation && customerLocation.distance > 20)
                }
                sx={{
                  height: 50,
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
                {placingOrder ? "Placing Order..." : "Place Order"}
              </Button>

              <Button
                fullWidth
                variant="text"
                onClick={() => navigate("/cart")}
                disabled={placingOrder}
                sx={{
                  mt: 1,
                  color: "#777",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Back to Cart
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Checkout;
