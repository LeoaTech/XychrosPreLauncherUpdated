
import { useQuery } from 'react-query';
import { useAuthenticatedFetch } from '../hooks';

const useFetchSettingsData = (url) => {
  const fetchData = useAuthenticatedFetch();

  const fetchSettings = async () => {
    const response = await fetchData(url);
    if (!response.ok) {
      throw new Error('Something went wrong while requesting Global Settings');
    }
    return response.json();
  };

  const { data, error } = useQuery('settings', fetchSettings);

  if (error) {
    console.log(error);
    // Handle the error case if needed

    return error;
  }

  return data || []; // Return empty array as default if data is not available yet
};

export default useFetchSettingsData;
