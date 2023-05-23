import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAuthenticatedFetch } from "../hooks";

const  useFetchPricingPlans = (url) => {
  const [data, setData] = useState([]);
  const fetchData = useAuthenticatedFetch();

  useEffect(() => {
    const fetchPricing = async () => {
      await fetchData(url)
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error("something went wrong while requesting Pricing Data");
        })
        .then((pricing) => {
          setData(pricing);
          return pricing;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    };
    fetchPricing();
  }, [url]);

  return data;
};

export default  useFetchPricingPlans;
