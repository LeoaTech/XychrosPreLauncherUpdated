import React, { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../hooks";

const useFetchUserDetails = (url) => {
  const [data, setData] = useState([]);
  const fetchData = useAuthenticatedFetch();

  useEffect(() => {
    const fetchUser = async () => {
      await fetchData(url)
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error("something went wrong while requesting user Data");
        })
        .then((user) => {
          setData(user);
          return user;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    };
    fetchUser();
  }, [url]);

  return data;
};

export default useFetchUserDetails;
