import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

const FoodContext = createContext();

export const FoodProvider = ({ children }) => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFoods = async () => {
    try {
      setLoading(true);

      const foodsSnapshot = await getDocs(
        collection(db, "foods")
      );

      const foodsData = foodsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFoods(foodsData);
    } catch (error) {
      console.error("Error fetching foods:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  return (
    <FoodContext.Provider
      value={{
        foods,
        loading,
        fetchFoods,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = () => {
  return useContext(FoodContext);
};