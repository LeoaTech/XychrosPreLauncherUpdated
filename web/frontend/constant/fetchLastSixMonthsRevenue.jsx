import { useQuery } from 'react-query';
import { useAuthenticatedFetch } from '../hooks';

const useFetchLastSixMonthsRevenue = (url) => {
    const fetchData = useAuthenticatedFetch();

    const fetchLastSixMonthsRevenue = async () => {
        const response = await fetchData(url);
        if (!response.ok) {
            console.log("Response ", response.json())
            throw new Error('Something Went Wrong While Fetching Last Six Months Revenue');
        }
        return response.json();
    };

    const { data, error } = useQuery('six_months_revenue', fetchLastSixMonthsRevenue);

    if (error) {
        console.log(error);
        // Handle the error case if needed

        return error;
    }

    return data || []; // Return empty array as default if data is not available yet
};

export default useFetchLastSixMonthsRevenue;


