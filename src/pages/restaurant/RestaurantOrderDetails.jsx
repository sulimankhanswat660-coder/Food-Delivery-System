import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowBack,
  CheckCircle,
  LocalShipping,
  LocationOn,
  Person,
  Phone,
  Restaurant,
  ShoppingBag,
  AccessTime,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";

const RESTAURANT_ID = 1;

const orderStatuses = [
  "Pending",
  "Accepted",
  "Preparing",
  "Ready",
  "Out for Delivery",
  "Delivered",
];

const RestaurantOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { currentUser, userData, loading: authLoading } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    if (userData?.role !== "restaurant") {
      navigate("/");
      return;
    }

    if (!id) {
      setError("Order ID is missing.");
      setLoading(false);
      return;
    }

    const orderRef = doc(db, "orders", id);

    const unsubscribe = onSnapshot(
      orderRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setError("Order not found.");
          setOrder(null);
          setLoading(false);
          return;
        }

        const orderData = {
          id: snapshot.id,
          ...snapshot.data(),
        };

        /*
          SINGLE RESTAURANT SYSTEM

          There is NO restaurants collection.

          Your foods use:
          restaurantId: 1

          Your orders use:
          restaurant: {
            id: 1,
            name: "Foodie Restaurant"
          }

          Therefore the restaurant ID is checked directly.
        */

        const orderRestaurantId = String(orderData.restaurant?.id ?? "");

        const currentRestaurantId = String(RESTAURANT_ID);

        if (orderRestaurantId !== currentRestaurantId) {
          setError("This order does not belong to your restaurant.");
          setOrder(null);
          setLoading(false);
          return;
        }

        setOrder(orderData);
        setError("");
        setLoading(false);
      },
      (snapshotError) => {
        console.error("Error fetching order:", snapshotError);
        setError("Failed to load order details.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [id, currentUser, userData, authLoading, navigate]);

  const handleStatusChange = async (newStatus) => {
    if (!order) return;

    /*
      Check restaurant ID before changing order status.
      This matches the same restaurant ID used by foods and orders.
    */
    const orderRestaurantId = String(order.restaurant?.id ?? "");

    if (orderRestaurantId !== String(RESTAURANT_ID)) {
      setError("This order does not belong to your restaurant.");
      return;
    }

    try {
      setUpdatingStatus(true);
      setError("");

      const orderRef = doc(db, "orders", order.id);

      await updateDoc(orderRef, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update order status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Date unavailable";

    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString();
    }

    return "Date unavailable";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Out for Delivery":
        return "info";
      case "Ready":
        return "primary";
      case "Preparing":
        return "warning";
      case "Accepted":
        return "secondary";
      default:
        return "default";
    }
  };

  const currentStatusIndex = order ? orderStatuses.indexOf(order.status) : 0;

  if (authLoading || loading) {
    return (
      <Box
        sx={{
          minHeight: "75vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff8f5",
        }}
      >
        <CircularProgress sx={{ color: "#ff5a36" }} />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box
        sx={{
          minHeight: "75vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          background: "#fff8f5",
        }}
      >
        <Card
          sx={{
            maxWidth: 500,
            width: "100%",
            borderRadius: 5,
            textAlign: "center",
            boxShadow: "0 15px 45px rgba(0,0,0,0.08)",
          }}
        >
          <CardContent sx={{ p: 5 }}>
            <Typography variant="h5" fontWeight={800} gutterBottom>
              Order Not Found
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {error || "We could not find this order."}
            </Typography>

            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/restaurant-dashboard")}
              sx={{
                background: "#ff5a36",
                borderRadius: 3,
                px: 3,
                py: 1.2,
                fontWeight: 700,
                "&:hover": {
                  background: "#e94d2d",
                },
              }}
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        background: "#fff8f5",
        py: { xs: 3, md: 5 },
        px: { xs: 1.5, sm: 3, md: 5 },
      }}
    >
      <Box sx={{ maxWidth: 1440, mx: "auto" }}>
        {/* HEADER */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/restaurant-dashboard")}
            sx={{
              color: "#666",
              mb: 1.5,
              px: 0,
              fontWeight: 600,
              "&:hover": {
                background: "transparent",
                color: "#ff5a36",
              },
            }}
          >
            Back to Dashboard
          </Button>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  fontSize: { xs: "1.8rem", md: "2.4rem" },
                }}
              >
                Order Details
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                Order #{order.id}
              </Typography>
            </Box>

            <Chip
              label={order.status || "Pending"}
              color={getStatusColor(order.status)}
              icon={<CheckCircle />}
              sx={{
                fontWeight: 700,
                px: 1,
                py: 2.7,
                borderRadius: 2.5,
              }}
            />
          </Box>
        </Box>

        {/* STATUS PANEL */}
        <Card
          sx={{
            borderRadius: 4,
            mb: 3,
            border: "1px solid #f1e5e0",
            boxShadow: "0 10px 35px rgba(0,0,0,0.04)",
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", md: "center" },
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 0.5 }}>
                  Order Progress
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Keep the customer updated by changing the order status.
                </Typography>
              </Box>

              <FormControl
                size="small"
                sx={{
                  width: { xs: "100%", md: 240 },
                }}
              >
                <InputLabel>Update Status</InputLabel>

                <Select
                  value={order.status || "Pending"}
                  label="Update Status"
                  disabled={updatingStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  sx={{
                    borderRadius: 2.5,
                    background: "#fff",
                  }}
                >
                  {orderStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* STATUS TIMELINE */}
            <Box
              sx={{
                display: "flex",
                overflowX: "auto",
                overflowY: "hidden",
                mt: 4,
                pb: 1,
                width: "100%",
                maxWidth: "100%",
                "&::-webkit-scrollbar": {
                  height: 5,
                },
              }}
            >
              {orderStatuses.map((status, index) => {
                const completed = index <= currentStatusIndex;

                return (
                  <Box
                    key={status}
                    sx={{
                      minWidth: { xs: 105, md: 145 },
                      flex: 1,
                      position: "relative",
                      textAlign: "center",
                    }}
                  >
                    {index < orderStatuses.length - 1 && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 16,
                          left: "50%",
                          width: "100%",
                          height: 3,
                          background:
                            index < currentStatusIndex ? "#ff5a36" : "#eee",
                          zIndex: 0,
                        }}
                      />
                    )}

                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        mx: "auto",
                        borderRadius: "50%",
                        background: completed ? "#ff5a36" : "#eeeeee",
                        color: completed ? "#fff" : "#999",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        zIndex: 1,
                        transition: "0.3s",
                      }}
                    >
                      {completed ? (
                        <CheckCircle sx={{ fontSize: 20 }} />
                      ) : (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#aaa",
                          }}
                        />
                      )}
                    </Box>

                    <Typography
                      variant="caption"
                      fontWeight={completed ? 700 : 500}
                      sx={{
                        display: "block",
                        mt: 1,
                        color: completed ? "#ff5a36" : "#888",
                      }}
                    >
                      {status}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </CardContent>
        </Card>

        {/* MAIN CONTENT */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              lg: "minmax(0, 1.5fr) minmax(0, 0.8fr)",
            },
            gap: 3,
            width: "100%",
            minWidth: 0,
          }}
        >
          {/* LEFT */}
          <Box>
            {/* CUSTOMER */}
            <Card
              sx={{
                borderRadius: 4,
                mb: 3,
                border: "1px solid #f1e5e0",
                boxShadow: "0 10px 35px rgba(0,0,0,0.04)",
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 2.5,
                      background: "#fff0eb",
                      color: "#ff5a36",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Person />
                  </Box>

                  <Box>
                    <Typography fontWeight={800}>
                      Customer Information
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Customer details
                    </Typography>
                  </Box>
                </Stack>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr",
                    },
                    gap: 2,
                    minWidth: 0,
                    width: "100%",
                  }}
                >
                  <InfoBox label="Customer Name" value={order.customer?.name} />

                  <InfoBox
                    label="Phone Number"
                    value={order.customer?.phone}
                    icon={<Phone fontSize="small" />}
                  />

                  <Box
                    sx={{
                      gridColumn: { xs: "auto", sm: "1 / -1" },
                      background: "#fafafa",
                      borderRadius: 3,
                      p: 2,
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <LocationOn
                        sx={{
                          color: "#ff5a36",
                          fontSize: 20,
                        }}
                      />

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Delivery Address
                        </Typography>

                        <Typography fontWeight={600} sx={{ mt: 0.3 }}>
                          {order.customer?.address || "Not available"}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* FOODS */}
            <Card
              sx={{
                borderRadius: 4,
                border: "1px solid #f1e5e0",
                boxShadow: "0 10px 35px rgba(0,0,0,0.04)",
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 2.5,
                      background: "#fff0eb",
                      color: "#ff5a36",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ShoppingBag />
                  </Box>

                  <Box>
                    <Typography fontWeight={800}>Ordered Items</Typography>

                    <Typography variant="body2" color="text.secondary">
                      {order.items?.length || 0} food item
                      {(order.items?.length || 0) !== 1 ? "s" : ""}
                    </Typography>
                  </Box>
                </Stack>

                <Stack spacing={1.5}>
                  {order.items?.map((item, index) => (
                    <Box
                      key={`${item.foodId}-${index}`}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 1.2, sm: 2 },
                        p: { xs: 1, sm: 1.5 },
                        borderRadius: 3,
                        background: "#fafafa",
                        border: "1px solid #f3f3f3",
                        minWidth: 0,
                        width: "100%",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{
                          width: { xs: 60, sm: 82 },
                          height: { xs: 60, sm: 82 },
                          borderRadius: 2.5,
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />

                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          fontWeight={700}
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: { xs: "normal", sm: "nowrap" },
                          }}
                        >
                          {item.name}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          Rs. {Number(item.price).toLocaleString()} ×{" "}
                          {item.quantity}
                        </Typography>

                        <Chip
                          label={`Qty: ${item.quantity}`}
                          size="small"
                          sx={{
                            mt: 1,
                            background: "#fff0eb",
                            color: "#ff5a36",
                            fontWeight: 700,
                          }}
                        />
                      </Box>

                      <Typography
                        fontWeight={800}
                        sx={{
                          color: "#171717",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                          fontSize: { xs: "0.8rem", sm: "1rem" },
                        }}
                      >
                        Rs.{" "}
                        {(
                          Number(item.price) * Number(item.quantity)
                        ).toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* RIGHT */}
          <Box>
            {/* ORDER SUMMARY */}
            <Card
              sx={{
                borderRadius: 4,
                mb: 3,
                background: "linear-gradient(145deg, #171717 0%, #292929 100%)",
                color: "#fff",
                boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
                  Order Summary
                </Typography>

                <Stack spacing={2}>
                  <SummaryRow
                    label="Subtotal"
                    value={`Rs. ${Number(
                      order.subtotal || 0,
                    ).toLocaleString()}`}
                  />

                  <SummaryRow
                    label="Delivery Fee"
                    value={`Rs. ${Number(
                      order.deliveryFee || 0,
                    ).toLocaleString()}`}
                  />

                  <Divider
                    sx={{
                      borderColor: "rgba(255,255,255,0.12)",
                    }}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography fontWeight={700}>Total</Typography>

                    <Typography
                      variant="h5"
                      fontWeight={900}
                      sx={{ color: "#ff7b5e" }}
                    >
                      Rs. {Number(order.total || 0).toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* PAYMENT */}
            <Card
              sx={{
                borderRadius: 4,
                mb: 3,
                border: "1px solid #f1e5e0",
                boxShadow: "0 10px 35px rgba(0,0,0,0.04)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography fontWeight={800} sx={{ mb: 2 }}>
                  Payment Information
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 3,
                    background: "#fafafa",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Payment Method
                  </Typography>

                  <Chip
                    label={order.paymentMethod || "Not specified"}
                    size="small"
                    sx={{
                      background: "#fff0eb",
                      color: "#ff5a36",
                      fontWeight: 700,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* DELIVERY */}
            <Card
              sx={{
                borderRadius: 4,
                mb: 3,
                border: "1px solid #f1e5e0",
                boxShadow: "0 10px 35px rgba(0,0,0,0.04)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 2.5 }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 2.5,
                      background: "#eef7ff",
                      color: "#1976d2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LocalShipping />
                  </Box>

                  <Typography fontWeight={800}>Delivery Information</Typography>
                </Stack>

                <Stack spacing={2}>
                  <InfoBox
                    label="Restaurant"
                    value={order.restaurant?.name || "Foodie Restaurant"}
                  />

                  <InfoBox
                    label="Distance"
                    value={`${order.deliveryLocation?.distance ?? "N/A"} km`}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "#777",
                    }}
                  >
                    <AccessTime fontSize="small" />

                    <Typography variant="body2">
                      Ordered: {formatDate(order.createdAt)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* BOTTOM */}
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/restaurant-dashboard")}
            sx={{
              borderColor: "#ff5a36",
              color: "#ff5a36",
              borderRadius: 3,
              px: 4,
              py: 1.3,
              fontWeight: 700,
              "&:hover": {
                borderColor: "#e94d2d",
                background: "#fff0eb",
              },
            }}
          >
            Back to Restaurant Dashboard
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

/* -------------------------
   Small Reusable Components
-------------------------- */

const InfoBox = ({ label, value, icon }) => {
  return (
    <Box
      sx={{
        background: "#fafafa",
        borderRadius: 3,
        p: 2,
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: "block",
          mb: 0.5,
        }}
      >
        {label}
      </Typography>

      <Stack direction="row" spacing={0.8} alignItems="center">
        {icon && (
          <Box
            sx={{
              color: "#ff5a36",
              display: "flex",
            }}
          >
            {icon}
          </Box>
        )}

        <Typography fontWeight={700}>{value || "Not available"}</Typography>
      </Stack>
    </Box>
  );
};

const SummaryRow = ({ label, value }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)" }}>
        {label}
      </Typography>

      <Typography fontWeight={600}>{value}</Typography>
    </Box>
  );
};

export default RestaurantOrderDetails;
