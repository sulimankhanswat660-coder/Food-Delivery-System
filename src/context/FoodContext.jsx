// import { createContext, useContext, useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   query,
//   limit,
//   startAfter,
// } from "firebase/firestore";
// import { db } from "../firebase/firebase";

// const FoodContext = createContext();

// const FOODS_PER_PAGE = 12;

// export const FoodProvider = ({ children }) => {
//   const [foods, setFoods] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [lastDoc, setLastDoc] = useState(null);
//   const [hasMore, setHasMore] = useState(true);

//   // Fetch first page
//   const fetchFoods = async () => {
//     try {
//       setLoading(true);

//       const foodsQuery = query(
//         collection(db, "foods"),
//         limit(6)
//       );

//       const foodsSnapshot = await getDocs(foodsQuery);

//       const foodsData = foodsSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       setFoods(foodsData);

//       const lastDocument =
//         foodsSnapshot.docs[foodsSnapshot.docs.length - 1];

//       setLastDoc(lastDocument || null);

//       setHasMore(foodsSnapshot.docs.length === FOODS_PER_PAGE);
//     } catch (error) {
//       console.error("Error fetching foods:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load next page
//   const loadMoreFoods = async () => {
//     if (!lastDoc || loadingMore || !hasMore) return;

//     try {
//       setLoadingMore(true);

//       const foodsQuery = query(
//         collection(db, "foods"),
//         startAfter(lastDoc),
//         limit(FOODS_PER_PAGE)
//       );

//       const foodsSnapshot = await getDocs(foodsQuery);

//       const newFoods = foodsSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       setFoods((prevFoods) => [...prevFoods, ...newFoods]);

//       const newLastDocument =
//         foodsSnapshot.docs[foodsSnapshot.docs.length - 1];

//       setLastDoc(newLastDocument || null);

//       setHasMore(newFoods.length === FOODS_PER_PAGE);
//     } catch (error) {
//       console.error("Error loading more foods:", error);
//     } finally {
//       setLoadingMore(false);
//     }
//   };

//   useEffect(() => {
//     fetchFoods();
//   }, []);

//   return (
//     <FoodContext.Provider
//       value={{
//         foods,
//         loading,
//         loadingMore,
//         hasMore,
//         fetchFoods,
//         loadMoreFoods,
//       }}
//     >
//       {children}
//     </FoodContext.Provider>
//   );
// };

// export const useFood = () => {
//   return useContext(FoodContext);
// };
