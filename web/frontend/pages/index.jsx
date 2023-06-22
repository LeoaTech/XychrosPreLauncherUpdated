import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchCampaign } from "../app/features/campaigns/campaignSlice";
import useFetchCampaignsData from "../constant/fetchCampaignsData";
import { SideBar, Header, HomeComponent, MainPage } from "../components/index";
import { useStateContext } from "../contexts/ContextProvider";
import { useThemeContext } from "../contexts/ThemeContext";
import "../index.css";
import { fetchProducts } from "../app/features/productSlice";
import useFetchAllProducts from "../constant/fetchProducts";
import useFetchSettings from "../constant/fetchGlobalSettings";
import { fetchSettings } from "../app/features/settings/settingsSlice";
import { fetchSavePlan } from "../app/features/current_plan/current_plan";
import useFetchBillingModel from "../constant/fetchBillingModel";
import useFetchPricingPlans from "../constant/fetchPricingPlans";
import useFetchReferralsData from '../constant/fetchReferralsData';
import { fetchReferrals } from '../app/features/referrals/referralSlice';
import useFetchCampaignsDetails from '../constant/fetchCampaignDetails';
import { fetchCampaignDetails } from '../app/features/campaign_details/campaign_details';

export default function HomePage() {
  const { activeMenu } = useStateContext();
  const { darkTheme } = useThemeContext();
  const dispatch = useDispatch();
  // Page render Scroll to Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  // Get Camapign Lists
  const campaigns = useFetchCampaignsData('/api/getcampaigns', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });


  // Get Referral List
  const referrals = useFetchReferralsData('/api/getallreferralcount', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  // Get All Products of App Store
  const product = useFetchAllProducts('/api/2022-10/products.json', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  // Get Global Settings
  const settings = useFetchSettings('/api/updatesettings', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });


  // Get Current Billing Details of App

  const billing = useFetchBillingModel("/api/subscribe-plan", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });


  // Get Camapign Details with all Campaign_settings

  const campaignsDetails = useFetchCampaignsDetails('/api/campaigndetails', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });


  // Dispatch API result in Redux store to get access data in the App
  useEffect(() => {
    if (billing) {
      dispatch(fetchSavePlan(billing))   //Save Current Billing Details in App Store
    }
  }, [dispatch, billing]);

  useEffect(() => {
    if (settings) {
      dispatch(fetchSettings(settings[0]));
    }
  }, [dispatch, settings]);

  useEffect(() => {
    if (campaigns) {
      dispatch(fetchCampaign(campaigns));
    }
  }, [campaigns]);

  useEffect(() => {
    if (product) {
      dispatch(fetchProducts(product));
    }
  }, [dispatch, product]);

  useEffect(() => {
    if (referrals) {
      dispatch(fetchReferrals(referrals));
    }
  }, [dispatch, referrals]);


  useEffect(() => {
    if (campaignsDetails?.length > 0) {
      dispatch(fetchCampaignDetails(campaignsDetails));
    }
  }, [campaignsDetails, dispatch]);



  return (
    <div className='app'>
      {activeMenu ? (
        <div className='header'>
          <Header />
        </div>
      ) : (
        <div className='header'>
          <Header />
        </div>
      )}
      <div className='main-app'>
        {activeMenu ? (
          <>
            <div className='sidebar'>
              <SideBar />
            </div>
            <div className='main-container'>
              <HomeComponent />
            </div>
          </>
        ) : (
          <>
            <div className='sidebar closed'>
              <SideBar />
            </div>
            <div className='main-container full'>
              <HomeComponent />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
