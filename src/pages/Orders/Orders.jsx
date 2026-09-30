import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";

const Orders = () => {
  const { currentUser } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const ordersQuery = query(
      collection(db, "orders"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const ordersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(ordersData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) {
      return "Date unavailable";
    }

    return timestamp.toDate().toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return {
          backgroundColor: "#e8f5e9",
          color: "#2e7d32",
        };

      case "Out for Delivery":
        return {
          backgroundColor: "#e3f2fd",
          color: "#1976d2",
        };

      case "Preparing":
        return {
          backgroundColor: "#fff3e0",
          color: "#ed6c02",
        };

      case "Accepted":
      case "Ready":
        return {
          backgroundColor: "#f3e5f5",
          color: "#7b1fa2",
        };

      case "Pending":
      default:
        return {
          backgroundColor: "#fff0eb",
          color: "#ff5a36",
        };
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "#ff5a36" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "80vh",
        backgroundColor: "#fafafa",
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#171717",
              mb: 1,
            }}
          >
            My Orders
          </Typography>

          <Typography
            sx={{
              color: "#777",
            }}
          >
            View your previous orders and track their status.
          </Typography>
        </Box>

        {/* Empty Orders */}
        {orders.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid #eeeeee",
              backgroundColor: "#fff",
              textAlign: "center",
              p: { xs: 4, md: 6 },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                mb: 1,
              }}
            >
              No Orders Yet
            </Typography>

            <Typography
              sx={{
                color: "#777",
                mb: 3,
              }}
            >
              You haven't placed any orders yet.
            </Typography>

            <Button
              component={Link}
              to="/foods"
              variant="contained"
              sx={{
                backgroundColor: "#ff5a36",
                borderRadius: 2,
                px: 3,
                py: 1.2,
                fontWeight: 700,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#e94d2d",
                },
              }}
            >
              Explore Foods
            </Button>
          </Card>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {orders.map((order) => {
              const statusStyle = getStatusColor(
                order.status || "Pending"
              );

              return (
                <Accordion
                  key={order.id}
                  disableGutters
                  elevation={0}
                  sx={{
                    borderRadius: "16px !important",
                    border: "1px solid #eeeeee",
                    backgroundColor: "#fff",
                    overflow: "hidden",

                    "&:before": {
                      display: "none",
                    },
                  }}
                >
                  {/* ACCORDION HEADER */}
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      px: { xs: 2.5, sm: 3 },
                      py: 1,
                      minHeight: 80,

                      "& .MuiAccordionSummary-content": {
                        margin: "12px 0",
                      },

                      "& .MuiAccordionSummary-content.Mui-expanded": {
                        margin: "12px 0",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        minWidth: 0,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: {
                            xs: "1rem",
                            sm: "1.05rem",
                          },
                          color: "#171717",
                        }}
                      >
                        Order #{order.id.slice(0,8)}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#777",
                          fontSize: "0.9rem",
                          mt: 0.5,
                        }}
                      >
                        {formatDate(order.createdAt)}
                      </Typography>
                    </Box>
                  </AccordionSummary>

                  {/* FULL ORDER CONTENT */}
                  <AccordionDetails
                    sx={{
                      px: { xs: 2.5, sm: 3 },
                      pb: { xs: 2.5, sm: 3 },
                      pt: 0,
                    }}
                  >
                    <Divider sx={{ mb: 2.5 }} />

                    {/* Status */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: {
                          xs: "flex-start",
                          sm: "center",
                        },
                        flexDirection: {
                          xs: "column",
                          sm: "row",
                        },
                        gap: 2,
                        mb: 2.5,
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            color: "#777",
                            fontSize: "0.85rem",
                          }}
                        >
                          Order Status
                        </Typography>

                        <Typography
                          sx={{
                            fontWeight: 700,
                            mt: 0.3,
                          }}
                        >
                          {order.status || "Pending"}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          ...statusStyle,
                          px: 2,
                          py: 0.8,
                          borderRadius: 10,
                          fontWeight: 700,
                          fontSize: "0.85rem",
                        }}
                      >
                        {order.status || "Pending"}
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 2.5 }} />

                    {/* Order Items */}
                    <Box sx={{ mb: 2.5 }}>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          mb: 2,
                        }}
                      >
                        Ordered Food
                      </Typography>

                      {order.items?.map((item, index) => (
                        <Box
                          key={`${item.foodId || item.id}-${index}`}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb:
                              index === order.items.length - 1
                                ? 0
                                : 2,
                            minWidth: 0,
                          }}
                        >
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.name}
                            sx={{
                              width: {
                                xs: 60,
                                sm: 65,
                              },
                              height: {
                                xs: 60,
                                sm: 65,
                              },
                              borderRadius: 2,
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
                              sx={{
                                fontWeight: 700,
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
                                fontSize: "0.9rem",
                                mt: 0.3,
                              }}
                            >
                              Rs. {item.price} × {item.quantity}
                            </Typography>
                          </Box>

                          <Typography
                            sx={{
                              fontWeight: 700,
                              flexShrink: 0,
                              fontSize: {
                                xs: "0.9rem",
                                sm: "1rem",
                              },
                            }}
                          >
                            Rs.{" "}
                            {(
                              Number(item.price || 0) *
                              Number(item.quantity || 0)
                            ).toLocaleString()}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    <Divider sx={{ mb: 2.5 }} />

                    {/* Bottom Information */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: {
                          xs: "flex-start",
                          sm: "center",
                        },
                        flexDirection: {
                          xs: "column",
                          sm: "row",
                        },
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            color: "#777",
                            fontSize: "0.85rem",
                          }}
                        >
                          Payment
                        </Typography>

                        <Typography
                          sx={{
                            fontWeight: 700,
                            mt: 0.3,
                          }}
                        >
                          {order.paymentMethod || "N/A"}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          textAlign: {
                            xs: "left",
                            sm: "right",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#777",
                            fontSize: "0.85rem",
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
                          Rs.{" "}
                          {Number(
                            order.total || 0
                          ).toLocaleString()}
                        </Typography>
                      </Box>

                      <Button
                        component={Link}
                        to={`/order/${order.id}`}
                        variant="outlined"
                        sx={{
                          borderColor: "#ff5a36",
                          color: "#ff5a36",
                          borderRadius: 2,
                          px: 2.5,
                          textTransform: "none",
                          fontWeight: 700,
                          "&:hover": {
                            borderColor: "#e94d2d",
                            backgroundColor: "#fff5f1",
                          },
                        }}
                      >
                        View & Track
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Orders;