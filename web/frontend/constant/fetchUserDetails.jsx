import { useQuery } from 'react-query';
import { useAuthenticatedFetch } from '../hooks';

const useFetchUserDetails = (url) => {
  const fetchData = useAuthenticatedFetch();

  const fetchUserDetails = async () => {
    const response = await fetchData(url);
    if (!response.ok) {
      throw new Error('Something went wrong while requesting User details List');
    }
    return response.json();
  };

  return useQuery('users', fetchUserDetails);

  // if (error) {
  //   console.log(error);
  //   // Handle the error case if needed

  //   return error;
  // }

  // return data || []; // Return empty array as default if data is not available yet
};

export default useFetchUserDetails;
