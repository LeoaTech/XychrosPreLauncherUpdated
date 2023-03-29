import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAuthenticatedFetch } from "../hooks";

const useFetchSettings = (url) => {
  const [data, setData] = useState([]);
  const fetchData = useAuthenticatedFetch();

  useEffect(() => {
    const fetchSettings = async () => {
      await fetchData(url)
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error("something went wrong while requesting posts");
        })
        .then((globalSettings) => {
          setData(globalSettings);
          return globalSettings;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    };
    fetchSettings();
  }, [url]);

  return data;
};

export default useFetchSettings;
