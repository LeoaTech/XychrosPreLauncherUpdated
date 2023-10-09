import { useQuery } from "react-query";
import { useAuthenticatedFetch } from "../hooks";

const useFetchAllProducts = (url) => {
  const fetchData = useAuthenticatedFetch();

  const fetchProducts = async () => {
    const response = await fetchData(url);
    if (!response.ok) {
      throw new Error(`Something went wrong while requesting Store's products`);
    }
    return response.json();
  };

  return useQuery("products", fetchProducts);
};

export default useFetchAllProducts;

/* import React, { useEffect, useState } from "react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

const useFetchAllProducts = (url) => {
  const [data, setData] = useState([]);
  const fetchData = useAuthenticatedFetch();

  useEffect(() => {
    const fetchProducts = async () => {
      await fetchData(url)
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error("something went wrong while requesting products");
        })
        .then((products) => {
          setData(products);
          return products;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    };
    fetchProducts();
  }, [url]);

  return data;
};

export default useFetchAllProducts;
 */
