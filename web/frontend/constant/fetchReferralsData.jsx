import { useQuery } from "react-query";
import { useAuthenticatedFetch } from "../hooks";

const useFetchReferralsData = (url) => {
  const fetchData = useAuthenticatedFetch();

  const fetchReferrals = async () => {
    const response = await fetchData(url);
    if (!response.ok) {
      throw new Error("Something went wrong while requesting Referrals Lists");
    }
    return response.json();
  };

  return useQuery("referrals", fetchReferrals);
  // if (error) {
  //   console.log(error);
  //   // Handle the error case if needed

  //   return error;
  // }

  // return data || []; // Return empty array as default if data is not available yet
};

export default useFetchReferralsData;


/* import React, { useEffect, useState } from 'react';
import { useAuthenticatedFetch } from '../hooks';

const useFetchReferralsData = (url) => {
  const [data, setData] = useState([]);
  const fetchData = useAuthenticatedFetch();

  useEffect(() => {
    const fetchReferrals = async () => {
      await fetchData(url)
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error('something went wrong while requesting Campaigns');
        })
        .then((Referrals) => {
          setData(Referrals);
          return Referrals;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    };
    fetchReferrals();
  }, [url]);

  return data;
};

export default useFetchReferralsData;
 */