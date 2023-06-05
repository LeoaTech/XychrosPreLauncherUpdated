import { useQuery } from 'react-query';
import { useAuthenticatedFetch } from '../hooks';

const useFetchPricingPlans = (url) => {
  const fetchData = useAuthenticatedFetch();

  const fetchPricing = async () => {
    const response = await fetchData(url);
    if (!response.ok) {
      throw new Error('Something went wrong while requesting Pricing Details List');
    }
    return response.json();
  };

  const { data, error } = useQuery('pricing', fetchPricing);

  if (error) {
    console.log(error);
    // Handle the error case if needed

    return error;
  }

  return data || []; // Return empty array as default if data is not available yet
};

export default useFetchPricingPlans;



