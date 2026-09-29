import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

const orderStatuses = [
  "Pending",
  "Accepted",
  "Preparing",
  "Ready",
  "Out for Delivery",
  "Delivered",
];

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const ordersQuery = query(
        collection(db, "orders"),
        where("restaurant.id", "==", 1),
      );

      const snapshot = await getDocs(ordersQuery);

      const ordersData = snapshot.docs.map((orderDoc) => ({
        id: orderDoc.id,
        ...orderDoc.data(),
      }));

      // Newest orders first
      ordersData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);

        return dateB - dateA;
      });

      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching restaurant orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);

      const orderRef = doc(db, "orders", orderId);

      const updateData = {
        status: newStatus,
      };

      // Save delivery time when order becomes Delivered
      if (newStatus === "Delivered") {
        updateData.deliveredAt = serverTimestamp();
      }

      await updateDoc(orderRef, updateData);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order,
        ),
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "warning";

      case "Accepted":
        return "info";

      case "Preparing":
        return "secondary";

      case "Ready":
        return "success";

      case "Out for Delivery":
        return "info";

      case "Delivered":
        return "success";

      default:
        return "default";
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) {
      return "Date unavailable";
    }

    return timestamp.toDate().toLocaleString();
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
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
        minHeight: "100vh",
        backgroundColor: "#fff8f5",
        py: { xs: 4, md: 6 },
        px: { xs: 2, sm: 3, md: 5 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
        }}
      >
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
            Restaurant Orders
          </Typography>

          <Typography
            sx={{
              color: "#666",
            }}
          >
            Manage customer orders and update their delivery status.
          </Typography>
        </Box>

        {/* Orders */}
        {orders.length === 0 ? (
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            }}
          >
            <CardContent
              sx={{
                py: 8,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                No Orders Found
              </Typography>

              <Typography
                sx={{
                  color: "#777",
                }}
              >
                Customer orders will appear here.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {orders.map((order) => (
              <Card
                key={order.id}
                sx={{
                  borderRadius: 4,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  {/* Order Header */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 2,
                      flexWrap: "wrap",
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: "1.05rem",
                        }}
                      >
                        Order #{order.id.slice(0, 8)}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#888",
                          fontSize: "0.85rem",
                          mt: 0.5,
                        }}
                      >
                        {formatDate(order.createdAt)}
                      </Typography>
                    </Box>

                    <Chip
                      label={order.status || "Pending"}
                      color={getStatusColor(order.status)}
                      sx={{
                        fontWeight: 700,
                      }}
                    />
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Customer */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        mb: 1.5,
                      }}
                    >
                      Customer Information
                    </Typography>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                        },
                        gap: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#555",
                          fontSize: "0.9rem",
                        }}
                      >
                        <strong>Name:</strong> {order.customer?.name || "N/A"}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#555",
                          fontSize: "0.9rem",
                        }}
                      >
                        <strong>Phone:</strong> {order.customer?.phone || "N/A"}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#555",
                          fontSize: "0.9rem",
                          gridColumn: {
                            xs: "auto",
                            sm: "1 / -1",
                          },
                        }}
                      >
                        <strong>Address:</strong>{" "}
                        {order.customer?.address || "N/A"}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Ordered Foods */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        mb: 1.5,
                      }}
                    >
                      Ordered Foods
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                      }}
                    >
                      {order.items?.map((item, index) => (
                        <Box
                          key={`${item.foodId}-${index}`}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: "#fafafa",
                            minWidth: 0,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              minWidth: 0,
                              overflow: "hidden",
                            }}
                          >
                            {item.image && (
                              <Box
                                component="img"
                                src={item.image}
                                alt={item.name}
                                sx={{
                                  width: 55,
                                  height: 55,
                                  objectFit: "cover",
                                  borderRadius: 2,
                                  flexShrink: 0,
                                }}
                              />
                            )}

                            <Box
                              sx={{
                                minWidth: 0,
                                overflow: "hidden",
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
                                  fontSize: "0.85rem",
                                }}
                              >
                                Rs. {item.price} × {item.quantity}
                              </Typography>
                            </Box>
                          </Box>

                          <Typography
                            sx={{
                              fontWeight: 800,
                              whiteSpace: "nowrap",
                              flexShrink: 0,
                            }}
                          >
                            Rs. {item.price * item.quantity}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Payment Summary */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        mb: 1.5,
                      }}
                    >
                      Payment Summary
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        maxWidth: 400,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography color="text.secondary">Subtotal</Typography>

                        <Typography fontWeight={600}>
                          Rs. {order.subtotal || 0}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography color="text.secondary">
                          Delivery Fee
                        </Typography>

                        <Typography fontWeight={600}>
                          Rs. {order.deliveryFee || 0}
                        </Typography>
                      </Box>

                      <Divider />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography fontWeight={800}>Total</Typography>

                        <Typography fontWeight={800} sx={{ color: "#ff5a36" }}>
                          Rs. {order.total || 0}
                        </Typography>
                      </Box>

                      <Typography
                        sx={{
                          color: "#777",
                          fontSize: "0.85rem",
                          mt: 0.5,
                        }}
                      >
                        Payment: {order.paymentMethod || "Not specified"}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Update Status */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          mb: 0.5,
                        }}
                      >
                        Update Order Status
                      </Typography>

                      <Typography
                        sx={{
                          color: "#777",
                          fontSize: "0.85rem",
                        }}
                      >
                        The customer will see the updated status.
                      </Typography>
                    </Box>

                    <FormControl size="small">
                      <Select
                        value={order.status || "Pending"}
                        disabled={updatingOrderId === order.id}
                        onChange={(event) =>
                          handleStatusChange(order.id, event.target.value)
                        }
                        sx={{
                          minWidth: {
                            xs: 220,
                            sm: 240,
                          },
                          borderRadius: 2,
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
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RestaurantOrders;
