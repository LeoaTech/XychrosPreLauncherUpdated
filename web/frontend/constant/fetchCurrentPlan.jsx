import { useQuery } from 'react-query';
import { useAuthenticatedFetch } from '../hooks';

const useFetchCurrentPlan = (url) => {
  const fetchData = useAuthenticatedFetch();

  const fetchCurrent = async () => {
    const response = await fetchData(url);
    if (!response.ok) {
      // throw new Error('Something went wrong while requesting Current Plan');
    }
    return response.json();
  };

  return useQuery('current-plan', fetchCurrent);

  // if (error) {
  //   console.log(error);
  //   // Handle the error case if needed

  //   return;
  // }

  // return data || null; // Return empty array as default if data is not available yet
};

export default useFetchCurrentPlan;



