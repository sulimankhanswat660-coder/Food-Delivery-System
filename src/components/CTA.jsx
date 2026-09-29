import {
  Box,
  Container,
  Typography,
  Button,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <Box
      sx={{
        py: { xs: 7, md: 9 },
        backgroundColor: "#fff5f2",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            backgroundColor: "#ff5a36",
            borderRadius: { xs: 4, md: 6 },
            px: { xs: 3, sm: 5, md: 8 },
            py: { xs: 5, md: 6 },
            textAlign: "center",
            color: "#ffffff",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-1px",
            }}
          >
            Hungry? Let's get you some food!
          </Typography>

          <Typography
            sx={{
              mt: 2,
              maxWidth: 600,
              mx: "auto",
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              color: "rgba(255,255,255,0.9)",
              lineHeight: 1.7,
            }}
          >
            Choose from our delicious food collection and enjoy
            fresh meals delivered straight to your door.
          </Typography>

          <Button
            component={Link}
            to="/foods"
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              mt: 3.5,
              backgroundColor: "#ffffff",
              color: "#ff5a36",
              px: 3.5,
              py: 1.4,
              borderRadius: 2.5,
              fontWeight: 800,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#fff8f5",
                boxShadow: "none",
              },
            }}
          >
            Explore Foods
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default CTA;

