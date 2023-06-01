import React, { useEffect, useState } from 'react';
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
