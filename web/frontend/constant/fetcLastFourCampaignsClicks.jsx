import { useQuery } from 'react-query';
import { useAuthenticatedFetch } from '../hooks';

const useFetchLastFourCampaignsClicks = (url) => {
    const fetchData = useAuthenticatedFetch();

    const fetchLastFourCampaignsClicks= async () => {
        const response = await fetchData(url);
        if (!response.ok) {
            console.log("Response ", response.json())
            throw new Error('Something Went Wrong While Fetching Last Four Campaigns User Clicks');
        }
        return response.json();
    };

    const { data, error } = useQuery('lastfourcampaigns_clicks', fetchLastFourCampaignsClicks);

    if (error) {
        console.log(error);
        // Handle the error case if needed

        return error;
    }

    return data || []; // Return empty array as default if data is not available yet
};

export default useFetchLastFourCampaignsClicks;


