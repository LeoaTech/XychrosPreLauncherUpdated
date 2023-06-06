
import { useQuery } from 'react-query';
import { useAuthenticatedFetch } from '../hooks';

const useFetchBillingModel = (url) => {
    const fetchData = useAuthenticatedFetch();

    const fetchBillingDetails = async () => {
        const response = await fetchData(url);
        if (!response.ok) {
            console.log("Response ",response.json())
            throw new Error('Something went wrong while requesting Current Billing Details');
        }
        return response.json();
    };

    const { data, error } = useQuery('billing', fetchBillingDetails);

    if (error) {
        console.log(error);
        // Handle the error case if needed

        return error;
    }

    return data || []; // Return empty array as default if data is not available yet
};

export default useFetchBillingModel;


