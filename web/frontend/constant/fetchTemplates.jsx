import { useQuery } from 'react-query';
import { useAuthenticatedFetch } from '../hooks';

const useFetchTemplates = (url) => {
  const fetchData = useAuthenticatedFetch();

  const fetchTemplates = async () => {
    const response = await fetchData(url);
    if (!response.ok) {
      throw new Error('Something went wrong while requesting Templates List');
    }
    return response.json();
  };

  const { data, error } = useQuery('templates', fetchTemplates);

  if (error) {
    console.log(error);

    // Handle the error case if needed

    return error;
  }

  return data || []; // Return empty array as default if data is not available yet
};


export default useFetchTemplates;
