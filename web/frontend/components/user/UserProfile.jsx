import React, { useEffect, useState } from "react";
import BillingCard from "./BillingCard";
import "./user.css";
import { BsCheck2 } from "react-icons/bs";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from 'react-icons/ai'
import { useAuthenticatedFetch } from "../../hooks";
import { fetchUserDetails, SaveUser } from "../../app/features/users/userSlice";
import { useDispatch, useSelector } from "react-redux";


// Pricing Card Details   
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
      }, {

        id: 3,
        icon: <BsCheck2 style={{ height: 21, width: 21, color: "#000" }} />,

        title: "Anti Fraud"
      },


    ],
    price: 0,
    btnText: "Subscribe"
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
    price: 4.99,
    btnText: "Subscribe"
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
    btnText: "Subscribe"
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
    btnText: "Subscribe"
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
    btnText: "Subscribe"
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
    btnText: "Subscribe"
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
    btnText: "Subscribe"
  },
  {
    id: 8,
    title: "Tier 7",
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
    btnText: "Subscribe"
  },
  {
    id: 9,
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
    btnText: "Subscribe"
  },

];
const UserProfile = () => {
  const data = useSelector(fetchUserDetails);
  const dispatch = useDispatch();

  const [subscribeMessage, setSubscribeMessage] = useState("")
  const fetch = useAuthenticatedFetch();
  // Initial User Form Data
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
  const [changeBtnText, setChangeBtnText] = useState("Subscribe")
  const [subscribedCardId, setSubscribedCardId] = useState(1);  //handle Biiling Card subscription ID
  const [title, setTitle] = useState("");
  const [isLoading, setIsloading] = useState(false)
  const findTitle = () => {
    for (let card of priceCard) {
      if (card.id === userDetails?.billing_id) {
        return card.title;
      }
    }
  }

  useEffect(() => {
    let mytitle = findTitle();
    setTitle(mytitle)

  }, [userDetails?.billing_id])

  useEffect(() => {
    if (data?.length > 0) {
      const mydata = data[0];
      let name = mydata?.username?.split(" ");
      if (name?.length > 0) {
        setUserDetails({ ...mydata, firstname: name[0], lastname: name[1], store_url: mydata?.store_url });
        setSubscribedCardId(mydata?.billing_id)
        setSubscribeMessage(`Subscribed to ${title}  price card. Billed and reset every month on the ${new Date().getDate()} at ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`)
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
    const newtitle = findTitle();
    setTitle(newtitle)
    setIsSubscribed(true);
    setUserDetails((prevState) => ({ ...prevState, billing_id: id }));
    setSubscribeMessage(`Subscribed to ${title}  pricecard. Billed and reset every month on the ${new Date().getDate()} at ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`)
  };


  // Save User Account Details

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true)
    if (data?.length > 0) {
      const response = await fetch("/api/userprofile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      })

      if (response.ok) {
        const newUserData = await response.json();
        await dispatch(SaveUser(newUserData));
        setIsloading(false)
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
      setIsloading(false)
    }
  };


  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const maxCardIndex = PriceDetails?.length - 1;
  const cardWidth = 300;


  const handleNext = () => {
    if (currentCardIndex < maxCardIndex) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  return (
    <div className="user-container">
      <div className="account-section">
        <div className="account-title">
          <h2>Account Details</h2>
        </div>

        {/* Contact Details Form */}
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

        {/* Billing Details with All Pricing Cards */}
        <div className="billing-details">
          <button class="next-btn" onClick={handleNext}><AiOutlineArrowRight /></button>
          <button class="prev-btn" onClick={handlePrevious}><AiOutlineArrowLeft /></button>
          <h3>Billing Details</h3>
          <p>{subscribeMessage}</p>
          <div className="carousel" >
            <div className="billing-cards" style={{
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

        {/* Save the Data  */}
        <div className="account-save">
          <button type="submit" onClick={handleSubmit} className="btnSave" disabled={userDetails?.billing_id === null}>
            {isLoading ? "Saving..." : " Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
