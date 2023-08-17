import { useQuery } from 'react-query';
import { useAuthenticatedFetch } from '../hooks';

const useFetchLastSixMonthsClicks = (url) => {
    const fetchData = useAuthenticatedFetch();

    const fetchLastSixMonthsClicks= async () => {
        const response = await fetchData(url);
        if (!response.ok) {
            console.log("Response ", response.json())
            throw new Error('Something Went Wrong While Fetching Last Six Months User Clicks Data');
        }
        return response.json();
    };

    const { data, error } = useQuery('lastsixmonths_clicks', fetchLastSixMonthsClicks);

    if (error) {
        console.log(error);
        // Handle the error case if needed

        return error;
    }

    return data || []; // Return empty array as default if data is not available yet
};

export default useFetchLastSixMonthsClicks;


