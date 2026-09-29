import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  Chip,
  Button,
  Divider,
} from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";

const RestaurantDashboard = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const fetchOrders = () => {
    const ordersQuery = query(
      collection(db, "orders"),
      where("restaurant.id", "==", 1),
    );

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const ordersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        ordersData.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);

          return dateB - dateA;
        });

        setOrders(ordersData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching restaurant orders:", error);
        setLoading(false);
      },
    );

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchOrders();

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const messagesQuery = query(
      collection(db, "contactMessages"),
      where("read", "==", false),
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      setUnreadMessages(snapshot.size);
    });

    return () => unsubscribe();
  }, []);

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending",
  ).length;

  const preparingOrders = orders.filter(
    (order) => order.status === "Accepted" || order.status === "Preparing",
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered",
  ).length;
  const totalSales = orders
    .filter((order) => order.status === "Delivered")
    .reduce((total, order) => total + (Number(order.total) || 0), 0);

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: <ShoppingBagOutlinedIcon />,
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: <PendingActionsOutlinedIcon />,
    },
    {
      title: "Preparing Orders",
      value: preparingOrders,
      icon: <RestaurantOutlinedIcon />,
    },
    {
      title: "Delivered Orders",
      value: deliveredOrders,
      icon: <CheckCircleOutlineOutlinedIcon />,
    },
    {
      title: "Unread Messages",
      value: unreadMessages,
      icon: <EmailOutlinedIcon />,
    },
    {
      title: "Total Sales",
      value: `Rs. ${totalSales}`,
      icon: <ShoppingBagOutlinedIcon />,
    },
   
  ];

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
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
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
            Restaurant Dashboard
          </Typography>

          <Typography
            sx={{
              color: "#666",
              fontSize: "1rem",
            }}
          >
            Manage your orders and monitor your restaurant activity.
          </Typography>
        </Box>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {stats.map((stat) => (
            <Grid key={stat.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      backgroundColor: "#fff0eb",
                      color: "#ff5a36",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>

                  <Typography
                    sx={{
                      color: "#777",
                      fontSize: "0.9rem",
                      mb: 0.5,
                    }}
                  >
                    {stat.title}
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      color: "#171717",
                    }}
                  >
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Card
          sx={{
            borderRadius: 4,
            mb: 4,
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                mb: 2,
              }}
            >
              Quick Actions
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                onClick={() => navigate("/manage-foods")}
                sx={{
                  backgroundColor: "#ff5a36",
                  borderRadius: 2.5,
                  px: 3,
                  py: 1.2,
                  fontWeight: 700,
                  "&:hover": {
                    backgroundColor: "#e94d2d",
                  },
                }}
              >
                Manage Foods
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate("/restaurant-orders")}
                sx={{
                  color: "#ff5a36",
                  borderColor: "#ff5a36",
                  borderRadius: 2.5,
                  px: 3,
                  py: 1.2,
                  fontWeight: 700,
                  "&:hover": {
                    borderColor: "#ff5a36",
                    backgroundColor: "#fff5f1",
                  },
                }}
              >
                View All Orders
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/contact-messages")}
                sx={{
                  color: "#ff5a36",
                  borderColor: "#ff5a36",
                  borderRadius: 2.5,
                  px: 3,
                  py: 1.2,
                  fontWeight: 700,
                  "&:hover": {
                    borderColor: "#ff5a36",
                    backgroundColor: "#fff5f1",
                  },
                }}
              >
                View Messages
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                mb: 2,
                flexWrap: "wrap",
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  Recent Orders
                </Typography>

                <Typography
                  sx={{
                    color: "#777",
                    fontSize: "0.9rem",
                    mt: 0.5,
                  }}
                >
                  Latest orders from your customers
                </Typography>
              </Box>

              <Button
                variant="text"
                onClick={() => navigate("/restaurant-orders")}
                sx={{
                  color: "#ff5a36",
                  fontWeight: 700,
                }}
              >
                View All
              </Button>
            </Box>

            <Divider sx={{ mb: 1 }} />

            {orders.length === 0 ? (
              <Box
                sx={{
                  py: 6,
                  textAlign: "center",
                }}
              >
                <ShoppingBagOutlinedIcon
                  sx={{
                    fontSize: 50,
                    color: "#ccc",
                    mb: 1,
                  }}
                />

                <Typography
                  sx={{
                    color: "#777",
                  }}
                >
                  No orders yet.
                </Typography>
              </Box>
            ) : (
              orders.slice(0, 5).map((order) => (
                <Box
                  key={order.id}
                  sx={{
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#171717",
                        mb: 0.5,
                      }}
                    >
                      Order #{order.id.slice(0, 8)}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        color: "#777",
                      }}
                    >
                      {order.customer?.name || "Customer"}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        color: "#999",
                        mt: 0.3,
                      }}
                    >
                      {formatDate(order.createdAt)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 800,
                        color: "#171717",
                      }}
                    >
                      Rs. {order.total || 0}
                    </Typography>

                    <Chip
                      label={order.status || "Pending"}
                      color={getStatusColor(order.status)}
                      size="small"
                      sx={{
                        fontWeight: 700,
                      }}
                    />

                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<VisibilityOutlinedIcon />}
                      onClick={() => navigate(`/restaurant-order/${order.id}`)}
                      sx={{
                        borderRadius: 2,
                        color: "#ff5a36",
                        borderColor: "#ff5a36",
                        fontWeight: 700,
                        "&:hover": {
                          borderColor: "#ff5a36",
                          backgroundColor: "#fff5f1",
                        },
                      }}
                    >
                      View
                    </Button>
                  </Box>
                </Box>
              ))
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default RestaurantDashboard;
