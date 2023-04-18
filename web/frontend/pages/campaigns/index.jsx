import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCampaign } from "../../app/features/campaigns/campaignSlice";
import { SideBar, Header, Campaign } from "../../components/index";
import useFetchCampaignsData from "../../constant/fetchCampaignsData";
import { useStateContext } from "../../contexts/ContextProvider";

const Campaigns = () => {
  const { activeMenu } = useStateContext();
  const dispatch = useDispatch();

  const campaigns = useFetchCampaignsData("/api/getcampaigns", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    if (campaigns?.length > 0) {
      dispatch(fetchCampaign(campaigns));
    }
  }, [campaigns, dispatch]);

  // Page render Scroll to Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="app">
      {activeMenu ? (
        <div className="header">
          <Header />
        </div>
      ) : (
        <div className="header">
          <Header />
        </div>
      )}
      <div className="main-app">
        {activeMenu ? (
          <>
            <div className="sidebar">
              <SideBar />
            </div>
            <div className="main-container">
              <Campaign />
            </div>
          </>
        ) : (
          <>
            <div className="sidebar closed">
              <SideBar />
            </div>
            <div className="main-container full">
              <Campaign />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Campaigns;
