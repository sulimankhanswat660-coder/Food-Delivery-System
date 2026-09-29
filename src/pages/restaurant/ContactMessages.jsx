import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { collection, onSnapshot, orderBy, query, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const messagesQuery = query(
      collection(db, "contactMessages"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const messagesData = snapshot.docs.map((messageDoc) => ({
          id: messageDoc.id,
          ...messageDoc.data(),
        }));

        setMessages(messagesData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const markAsRead = async (messageId) => {
    try {
      await updateDoc(doc(db, "contactMessages", messageId), {
        read: true,
      });
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fff8f5",
        minHeight: "calc(100vh - 70px)",
        py: { xs: 4, sm: 6, md: 8 },
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
            Customer Messages
          </Typography>

          <Typography
            sx={{
              fontWeight: 800,
              fontSize: {
                xs: "2rem",
                sm: "2.5rem",
                md: "3rem",
              },
            }}
          >
            Contact Messages
          </Typography>

          <Typography
            sx={{
              color: "#777",
              mt: 1,
            }}
          >
            View and manage messages sent by your customers.
          </Typography>
        </Box>

        {/* Messages */}
        {loading ? (
          <Paper
            elevation={0}
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: 4,
              border: "1px solid #eeeeee",
            }}
          >
            <Typography color="text.secondary">
              Loading messages...
            </Typography>
          </Paper>
        ) : messages.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 4,
              border: "1px solid #eeeeee",
            }}
          >
            <EmailOutlinedIcon
              sx={{
                fontSize: 55,
                color: "#ff5a36",
                mb: 1,
              }}
            />

            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1.3rem",
                mb: 1,
              }}
            >
              No messages yet
            </Typography>

            <Typography color="text.secondary">
              Customer messages will appear here.
            </Typography>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {messages.map((message) => (
              <Paper
                key={message.id}
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3 },
                  borderRadius: 4,
                  border: message.read
                    ? "1px solid #eeeeee"
                    : "1px solid #ff5a36",
                  backgroundColor: message.read ? "#fff" : "#fff8f5",
                }}
              >
                {/* Top */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                      xs: "flex-start",
                      sm: "center",
                    },
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: "1.1rem",
                      }}
                    >
                      {message.name}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#777",
                        fontSize: "0.9rem",
                      }}
                    >
                      {message.email}
                    </Typography>
                  </Box>

                  <Chip
                    label={message.read ? "Read" : "Unread"}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      backgroundColor: message.read
                        ? "#eeeeee"
                        : "#ffebe5",
                      color: message.read ? "#666" : "#ff5a36",
                    }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Subject */}
                <Typography
                  sx={{
                    fontWeight: 800,
                    mb: 1,
                  }}
                >
                  {message.subject}
                </Typography>

                {/* Message */}
                <Typography
                  sx={{
                    color: "#666",
                    lineHeight: 1.7,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {message.message}
                </Typography>

                {/* Action */}
                {!message.read && (
                  <Button
                    onClick={() => markAsRead(message.id)}
                    variant="contained"
                    startIcon={<MarkEmailReadOutlinedIcon />}
                    sx={{
                      mt: 2.5,
                      backgroundColor: "#ff5a36",
                      textTransform: "none",
                      fontWeight: 700,
                      borderRadius: 2.5,
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "#e94d2c",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Mark as Read
                  </Button>
                )}
              </Paper>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ContactMessages;