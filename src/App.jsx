import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  const { userData } = useAuth();

  const isRestaurant = userData?.role === "restaurant";

  return (
    <>
      <ScrollToTop />
      <Navbar />

      <AppRoutes />
      {!isRestaurant && <Footer />}
    </>
  );
};

export default App;
