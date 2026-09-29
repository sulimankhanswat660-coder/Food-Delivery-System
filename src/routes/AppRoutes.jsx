import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import SignUp from "../pages/aurth/SignUp";
import SignIn from "../pages/aurth/SignIn";
import FoodDetails from "../pages/Food/FoodDetails";
import Foods from "../pages/Food/Foods";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import OrderConfirmation from "../pages/Orders/OrderConfirmation";
import Orders from "../pages/Orders/Orders";
import OrderDetails from "../pages/Orders/OrderDetails";
import RestaurantDashboard from "../pages/restaurant/RestaurantDashboard";
import RestaurantOrders from "../pages/restaurant/RestaurantOrders";
import ManageFoods from "../pages/restaurant/ManageFoods";
import RestaurantOrderDetails from "../pages/restaurant/RestaurantOrderDetails";
import ContactMessages from "../pages/restaurant/ContactMessages";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import RestaurantProfile from "../pages/restaurant/RestaurantProfile";
import Profile from "../pages/Profile/Profile";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/foods" element={<Foods />} />
      <Route path="/foods/:id" element={<FoodDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />

      <Route path="/order-confirmation" element={<OrderConfirmation />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/order/:id" element={<OrderDetails />} />
      <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
      <Route
        path="/restaurant-order/:id"
        element={<RestaurantOrderDetails />}
      />
      <Route path="/restaurant-profile" element={<RestaurantProfile />} />
      <Route path="/restaurant-orders" element={<RestaurantOrders />} />
      <Route path="/manage-foods" element={<ManageFoods />} />
      <Route path="/contact-messages" element={<ContactMessages />} />
      <Route path="/profile" element={<Profile />} />


      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-in" element={<SignIn />} />
    </Routes>
  );
};

export default AppRoutes;
