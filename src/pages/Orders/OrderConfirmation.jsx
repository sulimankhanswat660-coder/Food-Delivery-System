import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const orderId = location.state?.orderId;
  const orderTotal = location.state?.orderTotal;

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
            p: { xs: 4, sm: 6 },
            textAlign: "center",
            borderRadius: 4,
            border: "1px solid #eeeeee",
          }}
        >
          {/* Success Icon */}
          <CheckCircleOutlinedIcon
            sx={{
              fontSize: 80,
              color: "#ff5a36",
              mb: 2,
            }}
          />

          {/* Heading */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 1,
            }}
          >
            Order Placed Successfully!
          </Typography>

          <Typography
            sx={{
              color: "#777",
              lineHeight: 1.7,
              mb: 4,
            }}
          >
            Thank you for your order. Your food will be prepared
            and delivered to you soon.
          </Typography>

          {/* Order Information */}
          {(orderId || orderTotal !== undefined) && (
            <Box
              sx={{
                backgroundColor: "#fff8f5",
                border: "1px solid #eeeeee",
                borderRadius: 3,
                p: 2.5,
                mb: 4,
                textAlign: "left",
              }}
            >
              {orderId && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: orderTotal !== undefined ? 2 : 0,
                  }}
                >
                  <ReceiptLongOutlinedIcon
                    sx={{
                      color: "#ff5a36",
                    }}
                  />

                  <Box>
                    <Typography
                      sx={{
                        color: "#777",
                        fontSize: "0.85rem",
                      }}
                    >
                      Order ID
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 800,
                        wordBreak: "break-all",
                      }}
                    >
                      #{orderId}
                    </Typography>
                  </Box>
                </Box>
              )}

              {orderTotal !== undefined && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#777",
                    }}
                  >
                    Total Amount
                  </Typography>

                  <Typography
                    sx={{
                      color: "#ff5a36",
                      fontWeight: 800,
                      fontSize: "1.15rem",
                    }}
                  >
                    Rs. {Number(orderTotal).toLocaleString()}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              flexDirection: {
                xs: "column",
                sm: "column",
              },
            }}
          >
            {orderId && (
              <Button
                fullWidth
                variant="contained"
                onClick={() =>
                  navigate(`/order/${orderId}`)
                }
                sx={{
                  height: 48,
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
                View & Track Order
              </Button>
            )}

            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/orders")}
              sx={{
                height: 48,
                borderRadius: 2.5,
                borderColor: "#ff5a36",
                color: "#ff5a36",
                fontWeight: 700,
                textTransform: "none",
                "&:hover": {
                  borderColor: "#ff5a36",
                  backgroundColor: "#fff5f1",
                },
              }}
            >
              My Orders
            </Button>

            <Button
              fullWidth
              variant="text"
              onClick={() => navigate("/foods")}
              sx={{
                height: 48,
                borderRadius: 2.5,
                color: "#555",
                fontWeight: 700,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#fafafa",
                },
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default OrderConfirmation;