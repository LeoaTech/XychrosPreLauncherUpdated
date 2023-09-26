import './HomeComponent.css';
import './home.css';
import { intro, about, arrow, Marketing, subscriber, Sale } from '../../assets/index';
import Charts from '../ui/Charts';
import React, { useState, useEffect, Fragment, lazy, Suspense } from 'react';
import { useStateContext } from '../../contexts/ContextProvider';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthenticatedFetch } from '../../hooks';
import SkeletonSummaryCard from '../loading_skeletons/SkeletonSummaryCard';
import LoadingSkeleton from '../loading_skeletons/LoadingSkeleton';
import { fetchAllCampaigns, fetchLastActiveCampaign, fetchAllSixMonthsCampaigns } from '../../app/features/campaigns/campaignSlice';
import { fetchAllReferrals, fetchLastFourCampaignsReferrals, fetchAllSixMonthsReferrals } from '../../app/features/referrals/referralSlice';
import { fetchAllCampaignClicks } from '../../app/features/user_clicks/totalclicksSlice';
import { fetchAllLastSixMonthsClicks } from '../../app/features/user_clicks/lastSixMonthsClicksSlice';
import { fetchAllLastFourCampaignsClicks } from '../../app/features/user_clicks/lastFourCampaignsClicksSlice';
import { fetchCampaignsDetailsList } from '../../app/features/campaign_details/campaign_details';
import { fetchAllCampaignsRevenue } from '../../app/features/revenue/totalRevenueSlice';
import { fetchAllLastSixMonthsRevenue } from '../../app/features/revenue/lastSixMonthsRevenueSlice';

const SummaryCard = lazy(() => import('../ui/SummaryCard'));

const HomeComponent = () => {
  const dispatch = useDispatch();
  const campaignDetails = useSelector(fetchCampaignsDetailsList);
  const ReferralList = useSelector(fetchAllReferrals);
  const TotalClicksList = useSelector(fetchAllCampaignClicks);
  const TotalRevenueList = useSelector(fetchAllCampaignsRevenue);
  const LastFourCampaignsReferralsList = useSelector(fetchLastFourCampaignsReferrals);
  const LastFourCampaignsClicksList = useSelector(fetchAllLastFourCampaignsClicks);
  const SixMonthCampaignList = useSelector(fetchAllSixMonthsCampaigns);
  const SixMonthReferralList = useSelector(fetchAllSixMonthsReferrals);
  const LastSixMonthsClicksList = useSelector(fetchAllLastSixMonthsClicks);
  const LastSixMonthsRevenueList = useSelector(fetchAllLastSixMonthsRevenue);
  const lastActiveCampaign = useSelector(fetchLastActiveCampaign);
  
  const [campaignsList, setCampaignsList] = useState([]);
  const [getReferrals, setReferrals] = useState([]);
  const [getTotalClicks, setTotalClicks] = useState([]);
  const [getTotalRevenue, setTotalRevenue] = useState([]);
  const [getLastFourCampaignsReferrals, setLastFourCampaignsReferrals] = useState([]);
  const [getLastFourCampaignsClicks, setLastFourCampaignsClicks] = useState([]);
  const [getSixMonthsCampaignsList, setSixMonthsCampaignsList] = useState([]);
  const [getSixMonthsReferralsList, setSixMonthsReferralsList] = useState([]);
  const [getLastSixMonthsClicksData, setLastSixMonthsClicksData] = useState([]);
  const [getLastSixMonthsRevenue, setLastSixMonthsRevenue] = useState([]);
  const [getLastActiveCampaign, setLastActiveCampaign] = useState({});

  // Get Total Campaigns Lists
  useEffect(() => {
    if (campaignDetails?.length > 0) {
      setCampaignsList(campaignDetails);
    }
  }, [campaignDetails, dispatch]);

  // Get Last Active Campaign
  useEffect(() => {
    if (lastActiveCampaign) {
      setLastActiveCampaign(lastActiveCampaign);
    }
  }, [lastActiveCampaign, dispatch]);

  // Get Last Campaigns Total Revenue
  let last_campaign_revenue;
  const lastCampaignRevenueInfo = TotalRevenueList?.find((item) => item.campaign_id === lastActiveCampaign?.campaign_id);
  if (lastCampaignRevenueInfo) {
    last_campaign_revenue = lastCampaignRevenueInfo.campaign_revenue;
  }

  // Get Last Six Months Campaigns Lists
  useEffect(() => {
    if (SixMonthCampaignList.length > 0) {
      setSixMonthsCampaignsList(SixMonthCampaignList);
      // console.log(SixMonthCampaignList);
    }
  }, [SixMonthCampaignList, dispatch]);

  // Get Referrals List
  useEffect(() => {
    if (ReferralList) {
      setReferrals(ReferralList);
    }
  }, [ReferralList, dispatch]);

  // Get Last Four Campaigns Referrals
  useEffect(() => {
    if (LastFourCampaignsReferralsList.length > 0) {
      setLastFourCampaignsReferrals(LastFourCampaignsReferralsList);
    }
  }, [LastFourCampaignsReferralsList, dispatch]);

  // Get Last Six Months Referrals Lists
  useEffect(() => {
    if (SixMonthReferralList.length > 0) {
      setSixMonthsReferralsList(SixMonthReferralList);
      // console.log(SixMonthReferralList);
    }
  }, [SixMonthReferralList, dispatch]);

  // Get Total Clicks Count
  useEffect(() => {
    if (TotalClicksList.length > 0) {
      setTotalClicks(TotalClicksList);
    }
  }, [TotalClicksList, dispatch]);

  // Get Last Six Months Clicks
  useEffect(() => {
    if (LastSixMonthsClicksList.length > 0) {
      setLastSixMonthsClicksData(LastSixMonthsClicksList);
      // console.log(LastSixMonthsClicksList);
    }
  }, [LastSixMonthsClicksList, dispatch]);

  // Get Last Four Campaigns Clicks
  useEffect(() => {
    if (LastFourCampaignsClicksList.length > 0) {
      setLastFourCampaignsClicks(LastFourCampaignsClicksList);
    }
  }, [LastFourCampaignsClicksList, dispatch]);

  // Get Total Revenue
  useEffect(() => {
    if (TotalRevenueList.length > 0) {
      setTotalRevenue(TotalRevenueList[0].currency + TotalRevenueList[0].total_revenue.toFixed(2));
    }
  }, [TotalRevenueList, dispatch]);

  // Get Last Six Months Revenue
  useEffect(() => {
    if (LastSixMonthsRevenueList.length > 0) {
      setLastSixMonthsRevenue(LastSixMonthsRevenueList);
      // console.log(LastSixMonthsRevenueList);
    }
  }, [LastSixMonthsRevenueList, dispatch]);

  // line chart and radar chart labels of last six months according to current date
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const chartLabels = Array.from({ length: 6 }, (_, index) => {
    const tempDate = new Date(currentYear, currentMonth - index, 1);
    tempDate.setMonth(tempDate.getMonth());

    const labelMonth = tempDate.toLocaleString('default', { month: 'long' });
    return labelMonth;
  }).reverse();
  // console.log(chartLabels);

  // line chart and radar chart data of last six months according to current date
  const chartClicks = Array.from({ length: 6 }, () => 0);
  const chartRevenue = Array.from({ length: 6 }, () => 0);

  if (getLastSixMonthsClicksData.length > 0) {
    getLastSixMonthsClicksData.forEach((entry) => {
      const entryDate = new Date(entry.created_month);
      const entryMonth = entryDate.getMonth();
      const entryYear = entryDate.getFullYear();

      const monthIndex =
        (currentYear - entryYear) * 12 + (currentMonth - entryMonth);

      chartClicks[monthIndex] = parseInt(entry.total_months_clicks, 10); // Convert to integer
    });
  }
  let finalClicks = chartClicks.reverse();
  
  if (getLastSixMonthsRevenue.length > 0) {
    getLastSixMonthsRevenue.forEach((entry) => {
      const entryDate = new Date(entry.created_month);
      const entryMonth = entryDate.getMonth();
      const entryYear = entryDate.getFullYear();

      const monthIndex =
        (currentYear - entryYear) * 12 + (currentMonth - entryMonth);

      chartRevenue[monthIndex] = parseFloat(entry.total_months_revenue.toFixed(2));
    });
  }
  let finalRevenue = chartRevenue.reverse();

  // Get Total Revenue For Last Six Months
  let six_months_total_revenue;
  if(getLastSixMonthsRevenue.length > 0) {
    const lastSixMonthsTotalRevenue = finalRevenue?.slice(0, 6).reduce((acc, currentValue) => acc + currentValue, 0);
    six_months_total_revenue = TotalRevenueList[0]?.currency + lastSixMonthsTotalRevenue.toFixed(2);
  }

  // --------------------- Constructing Line Chart -----------------
  const LineChartOptions = {
    responsive: true,
    animation: {
      easing: 'easeInOutQuad',
      duration: 520,
    },
    scales: {
      x: {
        grid: {
          color: '#fff',
        },
        ticks: {
          color: '#fff',
        },
      },
      y: {
        border: {
          display: true,
        },
        grid: {
          color: '#fff',
        },
        ticks: {
          color: '#fff',
          crossAlign: 'far',
          beginAtZero: true,
        },
      },
    },
    elements: {
      line: {
        tension: 0.05,
      },
    },
    legend: {
      display: false,
    },
    point: {
      backgroundColor: 'white',
    },
    tooltips: {
      titleFontFamily: 'Open Sans',
      backgroundColor: 'rgba(0,0,0,0.3)',
      titleFontColor: 'red',
      caretSize: 5,
      cornerRadius: 2,
      xPadding: 10,
      yPadding: 10,
    },
    labels: {
      color: '#FFFFFF',

      // This more specific font property overrides the global property
      font: {
        size: 14,
      },
    },
    plugins: {
      filler: {
        propagate: true,
      },
      legend: {
        position: 'bottom',
        labels: {
          color: '#FFFFFF',

          // This more specific font property overrides the global property
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: false,
      },
    },
  };

  const LineChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Revenue',
        data: finalRevenue,
        borderColor: '#165BAA',
        backgroundColor: '#165BAA',
        borderDash: [5, 5],
        fill: '',
      },
      {
        label: 'Clicks',
        data: finalClicks,
        borderColor: '#5447df',
        backgroundColor: '#5447df',
        borderDash: [10, 5],
        fill: '',
      },
      {
        label: 'Campaigns',
        data: getSixMonthsCampaignsList,
        borderColor: '#E0777D',
        backgroundColor: '#E0777D',
        fill: '+2',
      },
      {
        label: 'Referrals',
        data: getSixMonthsReferralsList,
        borderColor: '#A1F6F5',
        backgroundColor: '#A1F6F5',
        fill: 'origin',
      },
    ],
  };

  // // --------------- Constructing Radar Chart ---------------
  // let radarChartLabels = [];
  // if (getLastActiveCampaign) {
  //   const startDate = new Date(getLastActiveCampaign.start_date);
  //   const endDate = new Date(getLastActiveCampaign.end_date);
  //   const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  //   for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
  //     const formattedDate = date.toLocaleDateString('en-US', options);
  //     radarChartLabels.push(formattedDate);
  //   }
  
  //   console.log(radarChartLabels);
  // }

  const RadarChartOptions = {
    responsive: true,

    scales: {
      r: {
        angleLines: {
          display: false,
        },
        elements: {
          line: {
            borderWidth: 3,
          },
        },
        grid: {
          color: '#fff',
        },
        pointLabels: {
          color: '#fff',
        },
        ticks: {
          color: '#fff',
          backdropColor: 'transparent',
          fontWeight: 'bold',
        },
      },
    },

    plugins: {
      legend: {
        position: 'bottom',

        labels: {
          color: '#FFFFFF',
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: false,
      },
    },
  };

  const RadarChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Revenue',
        data: finalRevenue,
        borderColor: 'rgba(22,91,170, 0.7)',
        backgroundColor: 'rgba(22,91,170, 0.6)',
      },
      {
        label: 'Clicks',
        data: finalClicks,
        borderColor: 'rgba(84, 71, 223, 0.7)',
        backgroundColor: 'rgba(84, 71, 223, 0.4)',
      },
      {
        label: 'Campaigns',
        data: getSixMonthsCampaignsList,
        borderColor: 'rgba(245, 102, 128, 0.8)',
        backgroundColor: 'rgba(245, 102, 128, 0.5)',
      },
      {
        label: 'Referrals',
        data: getSixMonthsReferralsList,
        borderColor: 'rgba(161, 246, 245, 0.7)',
        backgroundColor: 'rgba(161, 246, 245, 0.6)',
      },
    ],
  };

  // donut chart labels and data according to latest four campaigns
  const donutChart_labels = [];
  const fourcampaigns_clicks = [];
  const donutChart_labels2 = [];
  const four_campaigns_referrals = [];

  // Loop through clicks details of last/latest four campaigns
  let sumOfLastFourCampaignsClicks;
  if(getLastFourCampaignsClicks.length > 0) {
      getLastFourCampaignsClicks.forEach((item) => {
      donutChart_labels.push(`${item.name}`);
      fourcampaigns_clicks.push(parseInt(item.campaign_clicks));
    });
    // Sum of the Last Four Campaigns' Clicks
    sumOfLastFourCampaignsClicks = parseInt(getLastFourCampaignsClicks[0].total_fourcampaigns_clicks);
  }

  // Loop through referrals details of last/latest four campaigns
  let sumOfLastFourCampaignsReferrals;
  if(getLastFourCampaignsReferrals.length > 0) {
      getLastFourCampaignsReferrals.forEach((item) => {
      donutChart_labels2.push(`${item.campaignName}`);
      four_campaigns_referrals.push(parseInt(item.totalReferrals));
    });
    // Sum of the Last Four Campaigns' Clicks
    sumOfLastFourCampaignsReferrals = four_campaigns_referrals.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
  }

  // --------------- Constructing Donut Chart ---------------
  const DonutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#FFFFFF',

          // This more specific font property overrides the global property
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: false,
      },
    },
  };

  const DonutChartData = {
    labels: donutChart_labels,
    datasets: [
      {
        data: fourcampaigns_clicks,
        backgroundColor: ['#FFFF8F', '#A1F6F5', '#F56680', '#5447df'],
        borderColor: ['#FFFF8F', '#A1F6F5', '#F56680', '#5447df'],
        borderWidth: 1,
      },
    ],
  };

  const DonutChartData2 = {
    labels: donutChart_labels2,
    datasets: [
      {
        data: four_campaigns_referrals,
        backgroundColor: ['#FFFF8F', '#A1F6F5', '#F56680', '#5447df'],
        borderColor: ['#FFFF8F', '#A1F6F5', '#F56680', '#5447df'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      {campaignsList === '' ? (
        <div className='home-container'>
          <h2>Welcome to Viral Launch!</h2>
          <div className='intro-section'>
            <div className='intro-card'>
              <p>
                New to Viral Launch? Get up to speed with everything about your
                product/service launch!
              </p>
            </div>
            <div className='intro-img'>
              <img
                src={intro}
                alt='INTRO'
                loading='lazy'
              />
            </div>
          </div>
          <div className='about-section'>
            <div className='about-img'>
              <img
                src={about}
                alt='About'
              />
            </div>
            <div className='about-card'>
              <p>
                Create a new campaign and get your email database filled even
                before you launch!
              </p>
            </div>
          </div>
          <div className='contact-us-section'>
            <div className='contact-us-card'>
              <p>Contact Us for further assistance and Feedback!</p>
            </div>
          </div>
        </div>
      ) : (
        <div className='home-container'>
          <div className='summary-blocks'>
            <Suspense fallback={<SkeletonSummaryCard />}>
              <SummaryCard
                value={campaignsList?.length}
                title='Campaigns'
                icon={Marketing}
                class='campaign-icon'
              />
            </Suspense>
            <Suspense fallback={<SkeletonSummaryCard />}>
              <SummaryCard
                value={getReferrals?.length}
                title='Referrals'
                icon={subscriber}
                class='referral-icon'
              />
            </Suspense>
            <Suspense fallback={<SkeletonSummaryCard />}>
              <SummaryCard
                value={getTotalClicks.length === 0 ? 0 : getTotalClicks[0].total_clicks}
                title='Clicks'
                icon={arrow}
                class='clicks-icon'
              />
            </Suspense>
            <Suspense fallback={<SkeletonSummaryCard />}>
              <SummaryCard
                  value={getTotalRevenue.length === 0 ? 0 : getTotalRevenue}
                  title='Revenue'
                  icon={Sale}
                  class='revenue-icon'
                />
            </Suspense>
          </div>
          <div className='single-chart'>
            <Charts
              type='line'
              header='Total Revenue'
              value={six_months_total_revenue || 0}
              subheader='Last 6 Months Data'
              LineChartOptions={LineChartOptions}
              LineChartData={LineChartData}
            />
          </div>
          <div className='dual-charts'>
            {Array.isArray(getLastFourCampaignsClicks) && getLastFourCampaignsClicks.length > 0 ? (
              <Charts
                type='donut'
                header='Total Clicks'
                value={sumOfLastFourCampaignsClicks || 0}
                subheader='Last 4 Campaigns Data'
                DonutChartOptions={DonutChartOptions}
                DonutChartData={DonutChartData}
              />
            ) : (
              <div className='intro-section'>
                <div className='intro-card'><p>No Last Four Campaigns Clicks Data Available Yet</p></div>
              </div>
            )}
            {Array.isArray(getLastFourCampaignsReferrals) && getLastFourCampaignsReferrals.length > 0 ? (
              <Charts
                type='donut'
                header='Total Referrals'
                value={sumOfLastFourCampaignsReferrals || 0}
                subheader='Last 4 Campaigns Data'
                DonutChartOptions={DonutChartOptions}
                DonutChartData={DonutChartData2}
              />
            ) : (
              <div className='intro-section'>
                <div className='intro-card'><p>Not Last Four Campaigns Referrals Data Available Yet</p></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeComponent;
