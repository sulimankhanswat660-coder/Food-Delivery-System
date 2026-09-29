import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import { auth } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

const Navbar = () => {
  const navigate = useNavigate();

  const { currentUser, userData } = useAuth();
  const { totalItems } = useCart();
const [unreadMessages, setUnreadMessages] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const isRestaurant = userData?.role === "restaurant";
useEffect(() => {
  if (userData?.role !== "restaurant") {
    setUnreadMessages(0);
    return;
  }

  const messagesQuery = query(
    collection(db, "contactMessages"),
    where("read", "==", false)
  );

  const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
    setUnreadMessages(snapshot.size);
  });

  return () => unsubscribe();
}, [userData]);
  const handleLogout = async () => {
    try {
      await signOut(auth);

      setAnchorEl(null);
      setMobileOpen(false);

      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

const handleProfile = () => {
  setAnchorEl(null);

  if (userData?.role === "restaurant") {
    navigate("/restaurant-profile");
  } else {
    navigate("/profile");
  }
};

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "#ffffff",
          color: "#171717",
          borderBottom: "1px solid #eeeeee",
        }}
      >
        <Toolbar
          sx={{
            maxWidth:1440,
            mx:'auto',
            width:'100%',
            minHeight: "72px !important",
            px: { xs: 2, md: 4 },
            position: "relative",
          }}
        >
          {/* Logo */}
          <Typography
            component={Link}
            to={isRestaurant ? "/restaurant-dashboard" : "/"}
            sx={{
              textDecoration: "none",
              color: "#171717",
              fontSize: { xs: "1.2rem", sm: "1.35rem" },
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: 0.7,
              whiteSpace: "nowrap",
            }}
          >
            🍔 FoodGo
          </Typography>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              alignItems: "center",
              gap: 3,
            }}
          >
            {isRestaurant ? (
              <>
                <Button
                  component={Link}
                  to="/restaurant-dashboard"
                  sx={{
                    color: "#171717",
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  Dashboard
                </Button>

                <Button
                  component={Link}
                  to="/restaurant-orders"
                  sx={{
                    color: "#171717",
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  Orders
                </Button>

                <Button
                  component={Link}
                  to="/manage-foods"
                  sx={{
                    color: "#171717",
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  Manage Foods
                </Button>
  <Button
  component={Link}
  to="/contact-messages"
  sx={{
    color: "#171717",
    fontWeight: 600,
    textTransform: "none",
  }}
>
  Messages

  {unreadMessages > 0 && (
    <Box
      sx={{
        ml: 0.8,
        minWidth: 20,
        height: 20,
        px: 0.6,
        borderRadius: "50%",
        backgroundColor: "#ff5a36",
        color: "#fff",
        fontSize: "0.7rem",
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {unreadMessages}
    </Box>
  )}
</Button>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/"
                  sx={{
                    color: "#171717",
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  Home
                </Button>

                <Button
                  component={Link}
                  to="/foods"
                  sx={{
                    color: "#171717",
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  Foods
                </Button>

                <Button
                  component={Link}
                  to="/about"
                  sx={{
                    color: "#171717",
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  About
                </Button>

                <Button
                  component={Link}
                  to="/contact"
                  sx={{
                    color: "#171717",
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  Contact
                </Button>

                {currentUser && (
                  <Button
                    component={Link}
                    to="/orders"
                    sx={{
                      color: "#171717",
                      fontWeight: 600,
                      textTransform: "none",
                    }}
                  >
                    Orders
                  </Button>
                )}
              </>
            )}
          </Box>

          {/* Desktop Right Side */}
          <Box
            sx={{
              marginLeft: "auto",
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            {currentUser ? (
              <>
                {/* Cart only for normal users */}
                {!isRestaurant && (
                  <IconButton
                    component={Link}
                    to="/cart"
                    sx={{
                      color: "#171717",
                      mr: 0.5,
                    }}
                  >
                    <Badge
                      badgeContent={totalItems}
                      color="error"
                      invisible={totalItems === 0}
                    >
                      <ShoppingCartOutlinedIcon />
                    </Badge>
                  </IconButton>
                )}

                {/* Profile */}
                <IconButton
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                  sx={{
                    p: 0,
                    ml: 0.5,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 38,
                      height: 38,
                      backgroundColor: "#ff5a36",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                    }}
                  >
                    {userData?.name?.charAt(0)?.toUpperCase() || (
                      <PersonOutlinedIcon />
                    )}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 190,
                      borderRadius: 2.5,
                    },
                  }}
                >
                  <MenuItem onClick={handleProfile}>
                    <PersonOutlinedIcon
                      sx={{ mr: 1.5, fontSize: 20 }}
                    />
                    Profile
                  </MenuItem>

                  {isRestaurant && (
                    <MenuItem
                      onClick={() => {
                        setAnchorEl(null);
                        navigate("/restaurant-dashboard");
                      }}
                    >
                      <DashboardOutlinedIcon
                        sx={{ mr: 1.5, fontSize: 20 }}
                      />
                      Dashboard
                    </MenuItem>
                  )}

                  <Divider />

                  <MenuItem onClick={handleLogout}>
                    <LogoutOutlinedIcon
                      sx={{ mr: 1.5, fontSize: 20 }}
                    />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/sign-in"
                  sx={{
                    color: "#171717",
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  Sign In
                </Button>

                <Button
                  component={Link}
                  to="/sign-up"
                  variant="contained"
                  sx={{
                    backgroundColor: "#ff5a36",
                    borderRadius: 2.5,
                    px: 2.5,
                    textTransform: "none",
                    fontWeight: 700,
                    "&:hover": {
                      backgroundColor: "#e94d2d",
                    },
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{
              display: { xs: "flex", md: "none" },
              marginLeft: "auto",
              color: "#171717",
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={closeMobile}
      >
        <Box
          sx={{
            width: 280,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Drawer Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
            }}
          >
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1.2rem",
              }}
            >
              🍔 FoodGo
            </Typography>

            <IconButton onClick={closeMobile}>
              <CloseOutlinedIcon />
            </IconButton>
          </Box>

          <Divider />

          <List sx={{ px: 1, py: 2 }}>
            {isRestaurant ? (
              <>
                <ListItemButton
                  component={Link}
                  to="/restaurant-dashboard"
                  onClick={closeMobile}
                  sx={{ borderRadius: 2 }}
                >
                  <DashboardOutlinedIcon
                    sx={{ mr: 1.5 }}
                  />
                  <ListItemText primary="Dashboard" />
                </ListItemButton>

                <ListItemButton
                  component={Link}
                  to="/restaurant-orders"
                  onClick={closeMobile}
                  sx={{ borderRadius: 2 }}
                >
                  <RestaurantMenuOutlinedIcon
                    sx={{ mr: 1.5 }}
                  />
                  <ListItemText primary="Orders" />
                </ListItemButton>

                <ListItemButton
                  component={Link}
                  to="/manage-foods"
                  onClick={closeMobile}
                  sx={{ borderRadius: 2 }}
                >
                  <RestaurantMenuOutlinedIcon
                    sx={{ mr: 1.5 }}
                  />
                  <ListItemText primary="Manage Foods" />
                </ListItemButton>
                <ListItemButton
  component={Link}
  to="/contact-messages"
  onClick={closeMobile}
  sx={{ borderRadius: 2 }}
>
  <ContactMailOutlinedIcon
    sx={{ mr: 1.5 }}
  />

  <ListItemText primary="Messages" />
</ListItemButton>
              </>
            ) : (
              <>
                <ListItemButton
                  component={Link}
                  to="/"
                  onClick={closeMobile}
                  sx={{ borderRadius: 2 }}
                >
                  <ListItemText primary="Home" />
                </ListItemButton>

                <ListItemButton
                  component={Link}
                  to="/foods"
                  onClick={closeMobile}
                  sx={{ borderRadius: 2 }}
                >
                  <ListItemText primary="Foods" />
                </ListItemButton>

                <ListItemButton
                  component={Link}
                  to="/about"
                  onClick={closeMobile}
                  sx={{ borderRadius: 2 }}
                >
                  <ListItemText primary="About" />
                </ListItemButton>

                <ListItemButton
                  component={Link}
                  to="/contact"
                  onClick={closeMobile}
                  sx={{ borderRadius: 2 }}
                >
                  <ListItemText primary="Contact" />
                </ListItemButton>

                {currentUser && (
                  <ListItemButton
                    component={Link}
                    to="/orders"
                    onClick={closeMobile}
                    sx={{ borderRadius: 2 }}
                  >
                    <ListItemText primary="Orders" />
                  </ListItemButton>
                )}

                {currentUser && (
                  <ListItemButton
                    component={Link}
                    to="/cart"
                    onClick={closeMobile}
                    sx={{ borderRadius: 2 }}
                  >
                    <ListItemText
                      primary={`Cart${
                        totalItems > 0
                          ? ` (${totalItems})`
                          : ""
                      }`}
                    />
                  </ListItemButton>
                )}
              </>
            )}
          </List>

          <Box sx={{ mt: "auto", p: 2 }}>
            <Divider sx={{ mb: 2 }} />

            {currentUser ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                    px: 1,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#ff5a36",
                      fontWeight: 700,
                    }}
                  >
                    {userData?.name
                      ?.charAt(0)
                      ?.toUpperCase() || (
                      <PersonOutlinedIcon />
                    )}
                  </Avatar>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.9rem",
                      }}
                    >
                      {userData?.name || "User"}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#777",
                        fontSize: "0.78rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {currentUser.email}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleProfile}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    color: "#171717",
                    borderColor: "#ddd",
                    textTransform: "none",
                  }}
                >
                  Profile
                </Button>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleLogout}
                  sx={{
                    backgroundColor: "#ff5a36",
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    "&:hover": {
                      backgroundColor: "#e94d2d",
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Button
                  fullWidth
                  component={Link}
                  to="/sign-in"
                  onClick={closeMobile}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    color: "#171717",
                    borderColor: "#ddd",
                  }}
                >
                  Sign In
                </Button>

                <Button
                  fullWidth
                  component={Link}
                  to="/sign-up"
                  onClick={closeMobile}
                  variant="contained"
                  sx={{
                    backgroundColor: "#ff5a36",
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    "&:hover": {
                      backgroundColor: "#e94d2d",
                    },
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
