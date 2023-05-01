import React, { useEffect, useState } from "react";
import BillingCard from "./BillingCard";
import "./user.css";
import { BsCheck2 } from "react-icons/bs";
import { RxCross2 } from 'react-icons/rx';
import { AiOutlineEdit, AiOutlineArrowRight, AiOutlineArrowLeft } from 'react-icons/ai'
import { useAuthenticatedFetch } from "../../hooks";
import { fetchUserDetails, SaveUser } from "../../app/features/users/userSlice";
import { useDispatch, useSelector } from "react-redux";

const PriceDetails = [
  {
    id: 1,
    title: "Free",
    feature: [
      {
        id: 1,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#000" }} />,
        title: "1 Active Campaign Created",
      },
      {
        id: 2,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#000" }} />,
        title: "50 Emails Collected",
      },


    ],
    price: 0,

  },
  {
    id: 2,
    title: "Tier 1",
    feature: [
      {
        id: 1,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "2 Active Campaigns ",
      },
      {
        id: 2,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "150 Emails Collected",
      },
      {

        id: 3,
        icon: <RxCross2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Anti Fraud"
      },
      {
        id: 4,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Double Opt In"
      }, {
        id: 5,
        icon: <RxCross2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Klaviyo Integration"
      }, {
        id: 6,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Custom Landing Pages"
      }
    ],
    price: 4.99,

  },
  {
    id: 3,
    title: "Tier 2",
    feature: [
      {
        id: 1,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,
        title: "Unlimited Active Campaigns",
      },
      {
        id: 2,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "450 Emails Collected",
      },
      {
        id: 3,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Anti Fraud"
      },
      {
        id: 4,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Double Opt In"
      }, {
        id: 5,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Klaviyo Integration"
      }, {
        id: 6,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Custom Landing Pages"
      }
    ],
    price: 8.99,

  },
  {
    id: 4,
    title: "Tier 3",
    feature: [
      {
        id: 1,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,
        title: "Unlimited Active Campaigns",
      },
      {
        id: 2,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "975 Emails Collected",
      },
      {
        id: 3,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Anti Fraud"
      },
      {
        id: 4,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Double Opt In"
      }, {
        id: 5,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Klaviyo Integration"
      }, {
        id: 6,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Custom Landing Pages"
      }
    ],
    price: 19.99,

  },
  {
    id: 5,
    title: "Tier 4",
    feature: [
      {
        id: 1,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,
        title: "Unlimited Active Campaigns",
      },
      {
        id: 2,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "1500 Emails Collected",
      },
      {
        id: 3,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Anti Fraud"
      },
      {
        id: 4,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Double Opt In"
      }, {
        id: 5,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Klaviyo Integration"
      }, {
        id: 6,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Custom Landing Pages"
      }
    ],
    price: 34.99,

  },
  {
    id: 6,
    title: "Tier 5",
    feature: [
      {
        id: 1,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,
        title: "Unlimited Active Campaigns",
      },
      {
        id: 2,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "2000 Emails Collected",
      },
      {
        id: 3,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Anti Fraud"
      },
      {
        id: 4,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Double Opt In"
      }, {
        id: 5,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Klaviyo Integration"
      }, {
        id: 6,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Custom Landing Pages"
      }
    ],
    price: 59.99,

  },
  {
    id: 7,
    title: "Tier 6",
    feature: [
      {
        id: 1,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,
        title: "Unlimited Active Campaigns",
      },
      {
        id: 2,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "3500 Emails Collected",
      },
      {
        id: 3,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Anti Fraud"
      },
      {
        id: 4,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Double Opt In"
      }, {
        id: 5,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Klaviyo Integration"
      }, {
        id: 6,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Custom Landing Pages"
      }
    ],
    price: 111.99,

  },
  {
    id: 8,
    title: "Tier 8",
    feature: [
      {
        id: 1,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,
        title: "Unlimited Active Campaigns",
      },
      {
        id: 2,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "5000 Emails Collected",
      },
      {
        id: 3,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Anti Fraud"
      },
      {
        id: 4,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Double Opt In"
      }, {
        id: 5,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Klaviyo Integration"
      }, {
        id: 6,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Custom Landing Pages"
      }
    ],
    price: 159.99,

  },
  {
    id: 9,
    title: "Tier 9",
    feature: [
      {
        id: 1,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,
        title: "Unlimited Active Campaigns",
      },
      {
        id: 2,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "6500+ Emails Collected",
      },
      {
        id: 3,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Anti Fraud"
      },
      {
        id: 4,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Double Opt In"
      }, {
        id: 5,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Klaviyo Integration"
      }, {
        id: 6,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#fff" }} />,

        title: "Custom Landing Pages"
      }
    ],
    price: 255.99,

  },

];
const UserProfile = () => {
  const data = useSelector(fetchUserDetails);
  const dispatch = useDispatch();

  // console.log(data, "kya data aa rha hai")

  const [subscribeMessage, setSubscribeMessage] = useState("")
  const fetch = useAuthenticatedFetch();
  const formData = {
    firstname: "",
    lastname: "",
    email: "",
    store_url: window.location?.ancestorOrigins[0] || "",
    billing_id: null,
  };

  const [userDetails, setUserDetails] = useState(formData);
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [priceCard, setPriceCard] = useState(PriceDetails)
  const [subscribedCardId, setSubscribedCardId] = useState(null);  //handle Biiling Card subscription ID
  const [isEdit, setIsEdit] = useState(false)

  const findTitle = () => {
    for (let card of priceCard) {
      if (card.id === userDetails?.billing_id) {
        return card.title;
      }
    }
  }
  useEffect(() => {
    if (data?.length > 0) {
      const mydata = data[0];
      let name = mydata?.username?.split(" ");
      if (name?.length > 0) {
        setUserDetails({ ...mydata, firstname: name[0], lastname: name[1], store_url: mydata?.store_url });
        setSubscribedCardId(mydata?.billing_id)
        setSubscribeMessage(`Subscribed to  price card. Billed and reset every month on the ${new Date().getDate()} at ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`)
      }
    } else {
      return;
    }
  }, [data]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };


  // Handle Price Card Subscription
  const handleSubscription = (id) => {
    setSubscribedCardId(id);   // Update the ID 
    // const title = findTitle()
    setIsSubscribed(true);
    setUserDetails((prevState) => ({ ...prevState, billing_id: id }));
    setSubscribeMessage(`Subscribed to  pricecard. Billed and reset every month on the ${new Date().getDate()} at ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`)
  };


  // Save User Account Details

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data, "agr data hai ")

    if (data?.length > 0) {
      console.log("this wala execute")
      const response = await fetch("/api/userprofile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      })
      console.log("response", response);

      if (response.ok) {
        const newUserData = await response.json();
        console.log(newUserData);
        await dispatch(SaveUser(newUserData))
      } else {
        return;
      }

    } else {
      await fetch("/api/userprofile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      })
        .then((res) => res.json())
        .then((data) => dispatch(SaveUser(data)))
        .catch((err) => console.log(err));
    }
  };

  const handleEdit = async () => {
    setIsEdit(true);
  }
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const maxCardIndex = PriceDetails?.length - 1;
  const cardWidth = 300;


  const handleNext = () => {
    console.log("clicked", maxCardIndex, "current", currentCardIndex)
    if (currentCardIndex < maxCardIndex) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  console.log(userDetails, "ye kya bakwas hai");
  return (
    <div className="user-container">
      <div className="account-section">
        <div className="account-title">
          <h2>Account Details</h2>
        </div>
        <div className="contact-details">
          <h3>Contact Details </h3>

          <div className="form-section">
            <div className="form-input-group">
              <div className="inputfield">
                <label htmlFor="firstname">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  id="firstname"
                  placeholder="e.g Joseph"
                  value={userDetails?.firstname}
                  onChange={handleChange}
                />
              </div>
              <div className="inputfield">
                <label htmlFor="lastname">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  id="lastname"
                  placeholder="e.g Henry"
                  value={userDetails?.lastname}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-input-group">
              <div className="inputfield">
                <label htmlFor="email">Contact Email</label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="joseph@gmail.com"
                  value={userDetails?.email}
                  onChange={handleChange}
                />
              </div>

              <div className="inputfield">
                <label htmlFor="storelink">Store URL</label>
                <input
                  type="text"
                  name="storelink"
                  id="storelink"
                  value={userDetails?.store_url}
                  onChange={handleChange}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        <div className="billing-details">

          <h3>Billing Details</h3>
           <button class="next-btn" onClick={handleNext}><AiOutlineArrowRight /></button>
          <button class="prev-btn" onClick={handlePrevious}><AiOutlineArrowLeft /></button>
          <p>
            {/* {subscribeMessage} */}
            {/* <a style={{ color: "blueviolet" }} href="#">   // UnComment this to see Billing Details(incomplete)
              See Details
            </a> */}
          </p>



          <div className="carousel" >
            <div className="billing-cards" style={{
              // transform: `translateX(-${currentCardIndex * (cardWidth + 10)}px)`,
            }}>
              {priceCard?.map((card, index) => {
                return (
                  <div key={index}
                    style={{
                      transform: `translateX(-${currentCardIndex * (cardWidth + 10)}px)`,
                    }}
                    className={`billing-card ${index === currentCardIndex ? 'active' : ''}`}>
                    <BillingCard
                      className="card"
                      key={card.id}
                      card={card}
                      handleSubscription={handleSubscription}
                      isSubscribed={card.id === subscribedCardId}
                    />
                  </div>
                );
              })}
            </div>
          </div>

         
        </div>
        <div className="account-save">
          <button type="submit" onClick={handleSubmit} className="btnSave">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
