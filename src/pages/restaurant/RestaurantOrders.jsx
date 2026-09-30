import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";
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

  // NEW: selected tab
  const [selectedStatus, setSelectedStatus] = useState("All");

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const ordersQuery = query(
        collection(db, "orders"),
        where("restaurant.id", "==", 1)
      );

      const snapshot = await getDocs(ordersQuery);

      const ordersData = snapshot.docs.map((orderDoc) => ({
        id: orderDoc.id,
        ...orderDoc.data(),
      }));

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
            : order
        )
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

  // NEW: filter orders according to selected tab
  const filteredOrders =
    selectedStatus === "All"
      ? orders
      : orders.filter(
          (order) => (order.status || "Pending") === selectedStatus
        );

  // NEW: count orders for each tab
  const getOrderCount = (status) => {
    if (status === "All") {
      return orders.length;
    }

    return orders.filter(
      (order) => (order.status || "Pending") === status
    ).length;
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

        {/* STATUS TABS */}
        {orders.length > 0 && (
          <Box
            sx={{
              mb: 4,
              display: "flex",
              gap: 1,
              overflowX: "auto",
              pb: 1,
              "&::-webkit-scrollbar": {
                height: 5,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#ddd",
                borderRadius: 10,
              },
            }}
          >
            {["All", ...orderStatuses].map((status) => {
              const isSelected = selectedStatus === status;
              const count = getOrderCount(status);

              return (
                <Button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  variant={isSelected ? "contained" : "outlined"}
                  sx={{
                    flexShrink: 0,
                    minWidth: "auto",
                    px: { xs: 2, sm: 2.5 },
                    py: 1,
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontWeight: 700,
                    whiteSpace: "nowrap",

                    ...(isSelected
                      ? {
                          backgroundColor: "#ff5a36",
                          color: "#fff",
                          borderColor: "#ff5a36",
                          "&:hover": {
                            backgroundColor: "#e94d2d",
                          },
                        }
                      : {
                          borderColor: "#e5d8d3",
                          color: "#555",
                          backgroundColor: "#fff",
                          "&:hover": {
                            borderColor: "#ff5a36",
                            color: "#ff5a36",
                            backgroundColor: "#fff5f1",
                          },
                        }),
                  }}
                >
                  {status} ({count})
                </Button>
              );
            })}
          </Box>
        )}

        {/* FILTERED ORDERS */}
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
        ) : filteredOrders.length === 0 ? (
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
                No {selectedStatus} Orders
              </Typography>

              <Typography
                sx={{
                  color: "#777",
                }}
              >
                There are currently no orders with this status.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {filteredOrders.map((order) => (
              <Accordion
                key={order.id}
                disableGutters
                elevation={0}
                sx={{
                  borderRadius: "16px !important",
                  border: "1px solid #eeeeee",
                  backgroundColor: "#fff",
                  overflow: "hidden",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.06)",

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
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: {
                          xs: "1rem",
                          sm: "1.05rem",
                        },
                        color: "#171717",
                        wordBreak: "break-word",
                      }}
                    >
                      Order #{order.id.slice(0,12)}
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

                {/* FULL ORDER */}
                <AccordionDetails
                  sx={{
                    px: { xs: 2.5, sm: 3 },
                    pb: { xs: 2.5, sm: 3 },
                    pt: 0,
                  }}
                >
                  <Divider sx={{ mb: 3 }} />

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
                      mb: 3,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          mb: 0.5,
                        }}
                      >
                        Current Order Status
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
                          sm: "1fr",
                        },
                        gap: 1.5,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#555",
                          fontSize: "0.9rem",
                        }}
                      >
                        <strong>Name:</strong>{" "}
                        {order.customer?.name || "N/A"}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#555",
                          fontSize: "0.9rem",
                        }}
                      >
                        <strong>Phone:</strong>{" "}
                        {order.customer?.phone || "N/A"}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#555",
                          fontSize: "0.9rem",
                          gridColumn: {
                            xs: "auto",
                            sm: "1 / -1",
                          },
                          wordBreak: "break-word",
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
                          key={`${item.foodId || item.id}-${index}`}
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
                            Rs.{" "}
                            {(
                              Number(item.price || 0) *
                              Number(item.quantity || 0)
                            ).toLocaleString()}
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
                        <Typography color="text.secondary">
                          Subtotal
                        </Typography>

                        <Typography fontWeight={600}>
                          Rs.{" "}
                          {Number(
                            order.subtotal || 0
                          ).toLocaleString()}
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
                          Rs.{" "}
                          {Number(
                            order.deliveryFee || 0
                          ).toLocaleString()}
                        </Typography>
                      </Box>

                      <Divider />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography fontWeight={800}>
                          Total
                        </Typography>

                        <Typography
                          fontWeight={800}
                          sx={{
                            color: "#ff5a36",
                          }}
                        >
                          Rs.{" "}
                          {Number(
                            order.total || 0
                          ).toLocaleString()}
                        </Typography>
                      </Box>

                      <Typography
                        sx={{
                          color: "#777",
                          fontSize: "0.85rem",
                          mt: 0.5,
                        }}
                      >
                        Payment:{" "}
                        {order.paymentMethod ||
                          "Not specified"}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Delivery Information */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        mb: 1.5,
                      }}
                    >
                      Delivery Information
                    </Typography>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "1fr 1fr",
                          md: "1fr 1fr 1fr",
                        },
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: "#fafafa",
                          p: 1.5,
                          borderRadius: 2,
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
                            fontWeight: 700,
                            mt: 0.3,
                          }}
                        >
                          {order.deliveryLocation?.distance ??
                            "N/A"}{" "}
                          km
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          backgroundColor: "#fafafa",
                          p: 1.5,
                          borderRadius: 2,
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
                            mt: 0.3,
                            wordBreak: "break-word",
                          }}
                        >
                          {order.deliveryLocation?.latitude ??
                            "N/A"}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          backgroundColor: "#fafafa",
                          p: 1.5,
                          borderRadius: 2,
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
                            mt: 0.3,
                            wordBreak: "break-word",
                          }}
                        >
                          {order.deliveryLocation?.longitude ??
                            "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Update Status */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: {
                        xs: "flex-start",
                        sm: "center",
                      },
                      justifyContent: "space-between",
                      gap: 2,
                      flexDirection: {
                        xs: "column",
                        sm: "row",
                      },
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
                        Change the status to update the customer.
                      </Typography>
                    </Box>

                    <FormControl
                      size="small"
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "240px",
                        },
                      }}
                    >
                      <Select
                        value={order.status || "Pending"}
                        disabled={
                          updatingOrderId === order.id
                        }
                        onChange={(event) =>
                          handleStatusChange(
                            order.id,
                            event.target.value
                          )
                        }
                        sx={{
                          borderRadius: 2,
                        }}
                      >
                        {orderStatuses.map((status) => (
                          <MenuItem
                            key={status}
                            value={status}
                          >
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {/* View Order */}
                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      component={Link}
                      to={`/restaurant-order/${order.id}`}
                      variant="outlined"
                      sx={{
                        borderColor: "#ff5a36",
                        color: "#ff5a36",
                        borderRadius: 2,
                        px: 3,
                        textTransform: "none",
                        fontWeight: 700,
                        "&:hover": {
                          borderColor: "#e94d2d",
                          backgroundColor: "#fff5f1",
                        },
                      }}
                    >
                      View Order
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RestaurantOrders;