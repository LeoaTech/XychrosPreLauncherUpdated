import React, { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../hooks";

const useFetchTemplates = (url) => {
  const [data, setData] = useState([]);
  const fetchData = useAuthenticatedFetch();

  useEffect(() => {
    const fetchTemplate = async () => {
      await fetchData(url)
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error("something went wrong while requesting templates");
        })
        .then((templates) => {
          setData(templates);
          return templates;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    };
    fetchTemplate();
  }, [url]);

  return data;
};

export default useFetchTemplates;
