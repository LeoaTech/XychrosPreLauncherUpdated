import React, { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../hooks";

const useFetchCampaignsData = (url) => {
  const [data, setData] = useState([]);
  const fetchData = useAuthenticatedFetch();

  useEffect(() => {
    const fetchCampaign = async () => {
      await fetchData(url)
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error("something went wrong while requesting posts");
        })
        .then((myCampaigns) => {
          setData(myCampaigns);
          return myCampaigns;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    };
    fetchCampaign();
  }, [url]);

  return data;
};

export default useFetchCampaignsData;
