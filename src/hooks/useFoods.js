
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  limit,
  query,
  startAfter,
  where,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

const PAGE_SIZE = 4;

const fetchFoods = async ({ pageParam = null, category = "All" }) => {
  const foodsRef = collection(db, "foods");

  const constraints = [];

  // Filter by category
  if (category !== "All") {
    constraints.push(where("category", "==", category));
  }

  // Get next page
  if (pageParam) {
    constraints.push(startAfter(pageParam));
  }

  // Number of foods per page
  constraints.push(limit(PAGE_SIZE));

  const foodsQuery = query(foodsRef, ...constraints);

  const snapshot = await getDocs(foodsQuery);

  const foods = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Last document is used as cursor
  const lastDoc =
    snapshot.docs[snapshot.docs.length - 1] || null;

  return {
    foods,
    lastDoc,
    hasMore: snapshot.docs.length === PAGE_SIZE,
  };
};

export const useFoods = (category = "All") => {
  return useInfiniteQuery({
    queryKey: ["foods", category],

    queryFn: ({ pageParam }) =>
      fetchFoods({
        pageParam,
        category,
      }),

    initialPageParam: null,

    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) {
        return undefined;
      }

      return lastPage.lastDoc;
    },

    // Don't refetch immediately when returning to the page
    staleTime: 5 * 60 * 1000,

    // Keep cached data for 30 minutes
    gcTime: 30 * 60 * 1000,
  });
};
