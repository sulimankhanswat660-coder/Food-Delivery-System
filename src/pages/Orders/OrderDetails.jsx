import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { doc, onSnapshot } from "firebase/firestore";
import { Link, useNavigate, useParams } from "react-router-dom";

import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";

const orderStatuses = [
  "Pending",
  "Accepted",
  "Preparing",
  "Ready",
  "Out for Delivery",
  "Delivered",
];

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!currentUser) {
      setLoading(false);
      navigate("/sign-in");
      return;
    }

    const orderRef = doc(db, "orders", id);

    const unsubscribe = onSnapshot(
      orderRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setErrorMessage("Order not found.");
          setOrder(null);
          setLoading(false);
          return;
        }

        const orderData = {
          id: snapshot.id,
          ...snapshot.data(),
        };

        if (orderData.userId !== currentUser.uid) {
          setErrorMessage("You do not have permission to view this order.");
          setOrder(null);
          setLoading(false);
          return;
        }

        setOrder(orderData);
        setErrorMessage("");
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to order:", error);
        setErrorMessage("Unable to load this order.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [id, currentUser, authLoading, navigate]);
  const getStatusMessage = (status) => {
    switch (status) {
      case "Pending":
        return "Your order has been received and is waiting for confirmation.";

      case "Accepted":
        return "Your order has been accepted by the restaurant.";

      case "Preparing":
        return "Your food is currently being prepared.";

      case "Ready":
        return "Your order is ready for delivery.";

      case "Out for Delivery":
        return "Your order is on the way to you.";

      case "Delivered":
        return "Your order has been delivered. Enjoy your meal!";

      default:
        return "Your order is being processed.";
    }
  };

  const currentStatusIndex = orderStatuses.indexOf(order?.status || "Pending");

  if (authLoading || loading) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 70px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff8f5",
        }}
      >
        <CircularProgress sx={{ color: "#ff5a36" }} />
      </Box>
    );
  }

  if (errorMessage) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 70px)",
          backgroundColor: "#fff8f5",
          py: { xs: 5, md: 8 },
        }}
      >
        <Container maxWidth="md">
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid #eeeeee",
              textAlign: "center",
              p: { xs: 3, md: 5 },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                mb: 1,
              }}
            >
              {errorMessage}
            </Typography>

            <Typography
              sx={{
                color: "#777",
                mb: 3,
              }}
            >
              We could not display the requested order.
            </Typography>

            <Button
              component={Link}
              to="/orders"
              variant="contained"
              sx={{
                backgroundColor: "#ff5a36",
                borderRadius: 2,
                px: 3,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#e94c2b",
                },
              }}
            >
              Back to Orders
            </Button>
          </Card>
        </Container>
      </Box>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 70px)",
        backgroundColor: "#fff8f5",
        py: { xs: 5, md: 7 },
        overflowX: "hidden",
      }}
    >
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              color: "#ff5a36",
              fontWeight: 700,
              mb: 1,
            }}
          >
            My Order
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: {
                xs: "2rem",
                md: "3rem",
              },
              mb: 1,
            }}
          >
            Order Details
          </Typography>
          <Typography
            sx={{
              color: "#777",
              wordBreak: "break-word",
            }}
          >
            Order ID: #{order.id}
          </Typography>

          <Typography
            sx={{
              color: "#999",
              fontSize: "0.9rem",
              mt: 0.5,
            }}
          >
            Ordered:{" "}
            {order.createdAt?.toDate
              ? order.createdAt.toDate().toLocaleString()
              : "Date unavailable"}
          </Typography>
        </Box>

        {/* Order Status */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            border: "1px solid #eeeeee",
            mb: 3,
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 2.5,
                md: 4,
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                mb: 4,
              }}
            >
              Order Status
            </Typography>

            {/* Status Tracker */}
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                overflowX: "auto",
                scrollbarWidth: "thin",
                pb: 1,
              }}
            >
              {orderStatuses.map((status, index) => {
                const completed = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;

                return (
                  <Box
                    key={status}
                    sx={{
                      flex: 1,
                      minWidth: {
                        xs: 110,
                        sm: 130,
                      },
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <CheckCircleIcon
                        sx={{
                          fontSize: {
                            xs: 28,
                            sm: 34,
                          },
                          color: completed ? "#ff5a36" : "#d9d9d9",
                        }}
                      />

                      <Typography
                        sx={{
                          mt: 1,
                          textAlign: "center",
                          fontSize: {
                            xs: "0.7rem",
                            sm: "0.8rem",
                          },
                          fontWeight: isCurrent ? 800 : 600,
                          color: completed ? "#ff5a36" : "#999",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {status}
                      </Typography>
                    </Box>

                    {index < orderStatuses.length - 1 && (
                      <Box
                        sx={{
                          height: 3,
                          minWidth: {
                            xs: 25,
                            sm: 45,
                          },
                          flex: 1,
                          mt: {
                            xs: "14px",
                            sm: "17px",
                          },
                          backgroundColor:
                            index < currentStatusIndex ? "#ff5a36" : "#e5e5e5",
                        }}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>
            {/* Current Status */}
            <Box
              sx={{
                mt: 4,
                p: 2.5,
                borderRadius: 3,
                backgroundColor: "#fff0eb",
              }}
            >
              <Typography
                sx={{
                  color: "#777",
                  fontSize: "0.9rem",
                }}
              >
                Current Status
              </Typography>

              <Typography
                sx={{
                  color: "#ff5a36",
                  fontWeight: 800,
                  fontSize: "1.2rem",
                  mt: 0.5,
                }}
              >
                {order.status || "Pending"}
              </Typography>

              <Typography
                sx={{
                  color: "#666",
                  fontSize: "0.9rem",
                  mt: 0.8,
                }}
              >
                {getStatusMessage(order.status || "Pending")}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Ordered Food */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            border: "1px solid #eeeeee",
            mb: 3,
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 2.5,
                md: 4,
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                mb: 3,
              }}
            >
              Ordered Food
            </Typography>

            {order.items?.map((item, index) => (
              <Box key={`${item.foodId || item.id}-${index}`}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    py: 2,
                    minWidth: 0,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{
                      width: {
                        xs: 70,
                        sm: 85,
                      },
                      height: {
                        xs: 70,
                        sm: 85,
                      },
                      objectFit: "cover",
                      borderRadius: 3,
                      flexShrink: 0,
                    }}
                  />

                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: {
                          xs: "0.95rem",
                          sm: "1rem",
                        },
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
                        mt: 0.5,
                        fontSize: {
                          xs: "0.85rem",
                          sm: "1rem",
                        },
                      }}
                    >
                      Rs. {item.price} × {item.quantity}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: {
                        xs: "0.9rem",
                        sm: "1rem",
                      },
                      flexShrink: 0,
                    }}
                  >
                    Rs.{" "}
                    {(
                      Number(item.price || 0) * Number(item.quantity || 0)
                    ).toLocaleString()}
                  </Typography>
                </Box>

                {index < order.items.length - 1 && <Divider />}
              </Box>
            ))}
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            border: "1px solid #eeeeee",
            mb: 3,
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 2.5,
                md: 4,
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                mb: 3,
              }}
            >
              Payment Summary
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Typography sx={{ color: "#777" }}>Subtotal</Typography>

              <Typography sx={{ fontWeight: 600 }}>
                Rs. {Number(order.subtotal || 0).toLocaleString()}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography sx={{ color: "#777" }}>Delivery Fee</Typography>

              <Typography sx={{ fontWeight: 600 }}>
                Rs. {Number(order.deliveryFee || 0).toLocaleString()}
              </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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
                  fontSize: "1.4rem",
                }}
              >
                Rs. {Number(order.total || 0).toLocaleString()}
              </Typography>
            </Box>

            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 3,
                backgroundColor: "#fafafa",
              }}
            >
              <Typography
                sx={{
                  color: "#777",
                  fontSize: "0.9rem",
                }}
              >
                Payment Method
              </Typography>

              <Typography
                sx={{
                  fontWeight: 700,
                  mt: 0.5,
                }}
              >
                {order.paymentMethod || "N/A"}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Delivery Details */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            border: "1px solid #eeeeee",
            mb: 3,
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 2.5,
                md: 4,
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                mb: 3,
              }}
            >
              Delivery Details
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography
                sx={{
                  color: "#777",
                  fontSize: "0.9rem",
                }}
              >
                Customer Name
              </Typography>

              <Typography
                sx={{
                  fontWeight: 700,
                  mt: 0.5,
                }}
              >
                {order.customer?.name || "N/A"}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography
                sx={{
                  color: "#777",
                  fontSize: "0.9rem",
                }}
              >
                Phone
              </Typography>

              <Typography
                sx={{
                  fontWeight: 700,
                  mt: 0.5,
                }}
              >
                {order.customer?.phone || "N/A"}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography
                sx={{
                  color: "#777",
                  fontSize: "0.9rem",
                }}
              >
                Address
              </Typography>

              <Typography
                sx={{
                  fontWeight: 700,
                  mt: 0.5,
                  wordBreak: "break-word",
                }}
              >
                {order.customer?.address || "N/A"}
              </Typography>
            </Box>

            {order.deliveryLocation && (
              <>
                <Divider sx={{ my: 3 }} />

                <Typography
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                  }}
                >
                  Delivery Location
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(3, 1fr)",
                    },
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#fafafa",
                      p: 2,
                      borderRadius: 2,
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#777",
                        fontSize: "0.85rem",
                      }}
                    >
                      Latitude
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 700,
                        mt: 0.5,
                        wordBreak: "break-word",
                      }}
                    >
                      {order.deliveryLocation.latitude}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      backgroundColor: "#fafafa",
                      p: 2,
                      borderRadius: 2,
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#777",
                        fontSize: "0.85rem",
                      }}
                    >
                      Longitude
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 700,
                        mt: 0.5,
                        wordBreak: "break-word",
                      }}
                    >
                      {order.deliveryLocation.longitude}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      backgroundColor: "#fff0eb",
                      p: 2,
                      borderRadius: 2,
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#777",
                        fontSize: "0.85rem",
                      }}
                    >
                      Distance
                    </Typography>

                    <Typography
                      sx={{
                        color: "#ff5a36",
                        fontWeight: 800,
                        mt: 0.5,
                      }}
                    >
                      {order.deliveryLocation.distance} km
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
          </CardContent>
        </Card>

        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Button
            component={Link}
            to="/orders"
            variant="outlined"
            sx={{
              borderColor: "#ff5a36",
              color: "#ff5a36",
              borderRadius: 2,
              px: 3,
              textTransform: "none",
              "&:hover": {
                borderColor: "#e94c2b",
                backgroundColor: "#fff5f1",
              },
            }}
          >
            Back to Orders
          </Button>

          <Button
            component={Link}
            to="/foods"
            variant="contained"
            sx={{
              backgroundColor: "#ff5a36",
              borderRadius: 2,
              px: 3,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#e94c2b",
              },
            }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default OrderDetails;
