import { useEffect } from "react";
import { SideBar, Header, UserProfile, MainPage } from "../components/index";
import { useStateContext } from "../contexts/ContextProvider";
import "../index.css";
import useFetchUserDetails from "../constant/fetchUserDetails";
import { useDispatch } from "react-redux";
import { SaveUser } from "../app/features/users/userSlice";
import useFetchPricingPlans from "../constant/fetchPricingPlans";
import { fetchpricing } from "../app/features/pricing/pricing";



const UserProfilePage = () => {
  const { activeMenu } = useStateContext();
  const dispatch = useDispatch();
  const userDetails = useFetchUserDetails("/api/userprofile", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });


  const response = useFetchPricingPlans("/api/pricing-plans", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Page render Scroll to Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (userDetails?.length > 0) {
      dispatch(SaveUser(userDetails));
    }
  }, [userDetails]);

   // Get All Pricing Details with Features
   useEffect(() => {
    if (response.length > 0) {
      dispatch(fetchpricing(response));
    }
  }, [dispatch, response]);

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
              <UserProfile />
            </div>
          </>
        ) : (
          <>
            <div className="sidebar closed">
              <SideBar />
            </div>
            <div className="main-container full">
              <UserProfile />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
