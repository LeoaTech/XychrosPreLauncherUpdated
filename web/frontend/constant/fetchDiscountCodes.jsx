import { useQuery } from 'react-query';
import { useAuthenticatedFetch } from '../hooks';

const useFetchDiscountCodes = (url) => {
  const fetchData = useAuthenticatedFetch();

  const fetchDiscountCodes = async () => {
    const response = await fetchData(url);
    if (!response.ok) {
      // throw new Error('Something went wrong while requesting Current Plan');
    }
    return response.json();
  };

  return useQuery('discount-codes', fetchDiscountCodes);

  // if (error) {
  //   console.log(error);
  //   // Handle the error case if needed

  //   return;
  // }

  // return data || []; // Return empty array as default if data is not available yet
};

export default useFetchDiscountCodes;



