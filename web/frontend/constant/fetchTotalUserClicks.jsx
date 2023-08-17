
import { useQuery } from 'react-query';
import { useAuthenticatedFetch } from '../hooks';

const useFetchTotalClicks = (url) => {
    const fetchData = useAuthenticatedFetch();

    const fetchTotalClicks= async () => {
        const response = await fetchData(url);
        if (!response.ok) {
            console.log("Response ", response.json())
            throw new Error('Something Went Wrong While Fetching Total User Clicks Count');
        }
        return response.json();
    };

    const { data, error } = useQuery('total_clicks', fetchTotalClicks);

    if (error) {
        console.log(error);
        // Handle the error case if needed

        return error;
    }

    return data || []; // Return empty array as default if data is not available yet
};

export default useFetchTotalClicks;


