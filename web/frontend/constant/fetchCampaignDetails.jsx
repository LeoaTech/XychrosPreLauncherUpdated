import { useQuery } from 'react-query';
import { useAuthenticatedFetch } from '../hooks';

const useFetchCampaignsDetails = (url) => {
  const fetchData = useAuthenticatedFetch();

  const fetchCampaignsDetails = async () => {
    const response = await fetchData(url);
    if (!response.ok) {
      throw new Error('Something went wrong while requesting Campaign Details');
    }
    return response.json();
  };

  return useQuery('campaignsDetails', fetchCampaignsDetails);
};

export default useFetchCampaignsDetails;


/* import { useQuery } from 'react-query';
import { useAuthenticatedFetch } from '../hooks';

const useFetchCampaignsDetails = (url) => {
  const fetchData = useAuthenticatedFetch();

  const fetchCampaignsDetails = async () => {
    const response = await fetchData(url);
    if (!response.ok) {
      throw new Error('Something went wrong while requesting Campaign Details List');
    }
    return response.json();
  };

  const { data, error } = useQuery('campaigns Details', fetchCampaignsDetails);

  if (error) {
    console.log(error);
    // Handle the error case if needed

    return error;
  }

  return data || []; // Return empty array as default if data is not available yet
};

export default useFetchCampaignsDetails;

 */