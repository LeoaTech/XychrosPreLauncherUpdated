import React, { useState, forwardRef, useEffect, useRef } from 'react';
// import { asset_url } from '@shopify/theme-utilities';

import { Link, useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { anime, BlackLogo } from '../../assets/index';

import * as images from '../../assets/index';
import { AiOutlineCalendar } from 'react-icons/ai';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { integratelinks } from './socialLinks';
import { useStateContext } from '../../contexts/ContextProvider';
import './newcampaign.css';
import { useDispatch, useSelector } from 'react-redux';
import './socialsBlocks/social.css';
import './rewardTier/RewardTier.css';
import {
  updateCampaign,
  fetchCampaignById,
  fetchCampaignByName,
  addNewCampaign,
  getTotalCampaigns,
  fetchCampaignsDiscount,
} from '../../app/features/campaigns/campaignSlice';
import { storeLinks } from './dummySocial';
import { RewardData } from './rewardTier/RewardData';
import { useAuthenticatedFetch } from '../../hooks';
import { fetchAllSettings } from '../../app/features/settings/settingsSlice';
import { fetchAllProducts } from '../../app/features/productSlice';
import useFetchTemplates from '../../constant/fetchTemplates';
import { useCallbackPrompt } from '../../hooks/useNavigatingPrompt';
import SaveDraft from '../modal/SaveDraft';
import { fetchCurrentTier } from '../../app/features/current_plan/current_plan';



function NewCampaignForm() {
  const { isEdit, setIsEdit } = useStateContext();
  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { campaignsid } = useParams();

  // Get Values from Redux-Store
  const campaignName = useSelector(fetchCampaignByName); //Get the Campaign Name to verify unique campaign name
  const campaignsDiscountCode = useSelector(fetchCampaignsDiscount);

  const settings = useSelector(fetchAllSettings); //Settings Data
  const products = useSelector(fetchAllProducts); //Get all products of Shop
  const totalCampaigns = useSelector(getTotalCampaigns);
  const currentTier = useSelector(fetchCurrentTier);

  const campaignById = useSelector(
    (state) => fetchCampaignById(state, Number(campaignsid)) // Get A Single Campaign with ID
  );

  // Get Tomorrow Date and  Date for next 6 days for the Campaign End Date 
  let today = new Date();
  let getStartDate = new Date()
  let getNextDate = new Date();
  getNextDate.setDate(today.getDate() + 6);
  getStartDate.setDate(today.getDate() + 1)

  // Local States of Components

  const [errorMessage, setErrorMessage] = useState(false);
  const [error, setError] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [discountCode1, setDiscountCode1] = useState(false);
  const [discountCode2, setDiscountCode2] = useState(false);
  const [discountCode3, setDiscountCode3] = useState(false);
  const [discountCode4, setDiscountCode4] = useState(false);

  const [editCampaignData, setEditCampaignData] = useState({});
  const [discountList, setDiscountList] = useState([])
  const [globalSettings, setGlobalSettings] = useState();
  const [productsData, setProductsData] = useState([]);
  const [startDate, setStartDate] = useState(getStartDate);
  const [endDate, setEndDate] = useState(getNextDate);

  const [draftModal, setDraftModal] = useState(false);
  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(draftModal);
  const [templateList, setTemplateList] = useState([]); //To store all templates received from Template API
  const [randomTemplate, setRandomTemplate] = useState(); //Get Random Template from templateList
  const [selectedTemplateData, setSelectedTemplateData] = useState(); //Store the selected template data
  const [expanded, setExpanded] = useState([
    true,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [klaviyoList, setKlaviyoList] = useState([]);
  const [myPlan, setMyPlan] = useState('');
  const [TotalCampaign, setTotalCampaign] = useState();

  //? New Campaign Form Data Fields
  const [newCampaignData, setNewCampaignData] = useState({
    collect_phone: globalSettings?.collect_phone,
    discord_link: globalSettings?.discord_link,
    double_opt_in: globalSettings?.double_opt_in,
    double_opt_in_email: globalSettings?.double_opt_in_email,
    end_date: endDate,
    facebook_link: globalSettings?.facebook_link,
    instagram_link: globalSettings?.instagram_link,
    klaviyo_integration: globalSettings?.klaviyo_integration,
    klaviyo_list_id: '',
    name: '',
    product: '',
    klaviyo_api_key: globalSettings?.klaviyo_api_key,
    referral_email: globalSettings?.referral_email,
    reward_1_code: globalSettings?.reward_1_code,
    reward_1_discount: globalSettings?.reward_1_discount,
    reward_1_tier: globalSettings?.reward_1_tier,
    reward_2_code: globalSettings?.reward_2_code,
    reward_2_discount: globalSettings?.reward_2_discount,
    reward_2_tier: globalSettings?.reward_2_tier,
    reward_3_code: globalSettings?.reward_3_code,
    reward_3_discount: globalSettings?.reward_3_discount,
    reward_3_tier: globalSettings?.reward_3_tier,
    reward_4_code: globalSettings?.reward_4_code,
    reward_4_discount: globalSettings?.reward_4_discount,
    reward_4_tier: globalSettings?.reward_4_tier,
    reward_email: globalSettings?.reward_email,
    share_discord_message: globalSettings?.share_discord_message,
    share_discord_referral: globalSettings?.share_discord_referral,
    share_email_message: globalSettings?.share_email_message,
    share_email_referral: globalSettings?.share_email_referral,
    share_facebook_message: globalSettings?.share_facebook_message,
    share_facebook_referral: globalSettings?.share_facebook_referral,
    share_instagram_message: globalSettings?.share_instagram_message,
    share_instagram_referral: globalSettings?.share_instagram_referral,
    share_snapchat_message: globalSettings?.share_snapchat_message,
    share_snapchat_referral: globalSettings?.share_snapchat_referral,
    share_tiktok_message: globalSettings?.share_tiktok_message,
    share_tiktok_referral: globalSettings?.share_tiktok_referral,
    share_twitter_message: globalSettings?.share_twitter_message,
    share_twitter_referral: globalSettings?.share_twitter_referral,
    share_whatsapp_message: globalSettings?.share_whatsapp_message,
    share_whatsapp_referral: globalSettings?.share_whatsapp_referral,
    show_discord_link: globalSettings?.show_discord_link,
    show_facebook_link: globalSettings?.show_facebook_link,
    show_instagram_link: globalSettings?.show_instagram_link,
    show_snapchat_link: globalSettings?.show_snapchat_link,
    show_tiktok_link: globalSettings?.show_tiktok_link,
    show_twitter_link: globalSettings?.show_twitter_link,
    snapchat_link: globalSettings?.snapchat_link,
    start_date: startDate,
    tiktok_link: globalSettings?.tiktok_link,
    twitter_link: globalSettings?.twitter_link,
    welcome_email: globalSettings?.welcome_email,
    template_id: 1,
    discount_type: globalSettings?.discount_type,
  });

  const [getCampaignName, setCampaignName] = useState();



  // Check if page URL is New Camapign or Campaign/id then render the form 
  useEffect(() => {
    if (window.location.pathname === `/campaigns/${campaignsid}`) {
      setIsEdit(true);
    } else if (window.location.pathname === `/newcampaign`) {
      setIsEdit(false);
    }
  }, [isEdit]);



  // Get All Campaigns Discount Code List
  useEffect(() => {
    if (campaignsDiscountCode?.length > 0) {
      // Use Set to remove duplicates and convert back to an array
      let uniqueCodes = [...new Set(campaignsDiscountCode)];
      setDiscountList(uniqueCodes)
    }
  }, [campaignsDiscountCode])


  // Get the Data with Campaigns ID for Edit campaign
  useEffect(() => {
    if (campaignById !== undefined) {
      setEditCampaignData({ ...campaignById });
    }
  }, [campaignById]);

  //! Re-render all the global settings fields into the Form
  useEffect(() => {
    if (settings?.length > 0) {
      setGlobalSettings(settings[0]);
    }
  }, [settings]);

  // get the Products in select box
  useEffect(() => {
    if (products?.length > 0) {
      setProductsData(products);
    }
  }, [products]);

  // Get New Campaign Form pre-filled fields From Global Settings
  useEffect(() => {
    if (globalSettings !== undefined) {
      setNewCampaignData((prevState) => ({
        ...prevState,
        ...globalSettings,
      }));
    }
  }, [globalSettings]);

  // Fetch Templates Data from API
  const templateData = useFetchTemplates('/api/templates', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // if Fetch result is successful store the result in templateList
  useEffect(() => {
    if (templateData?.length > 0) {
      setTemplateList(templateData);

    }
  }, [templateData]);


  // Generate Random Templates Array with Template Ids
  useEffect(() => {
    const filtered_templates = [];
    if (templateList?.length > 0) {
      // Basic Template will remain unchanged
      const basicTemplate = templateList?.find(
        (template) => template?.campaign_image === null
      );

      // Get Random templates based on the campaign name in the Form field
      const variantTemplate = templateList?.filter(
        (template) => template?.campaign_image !== null
      );

      // Select Templates for Edit a Campaign Form
      if (isEdit) {
        const editSelectTemplate = templateList?.filter(
          (template) => template?.id === editCampaignData?.template_id
        );
        const filtered = templateList?.filter((template) =>
          editCampaignData?.name
            ?.toLowerCase()
            .includes(template.campaign_name?.toLowerCase())
        );

        if (editSelectTemplate[0].id !== basicTemplate?.id) {
          filtered_templates.push(basicTemplate);
          if (filtered[0]?.id !== editSelectTemplate[0]?.id) {
            filtered_templates.push(editSelectTemplate[0]);
            filtered_templates.push(
              ...variantTemplate
                .slice(1)
                .sort(() => 0.5 - Math.random())
                .slice(0, 1)
            );
          } else {
            filtered_templates.push(
              ...variantTemplate
                .slice(1)
                .sort(() => 0.5 - Math.random())
                .slice(0, 2)
            );
          }
        } else {
          filtered_templates.push(editSelectTemplate[0]);
          filtered_templates.push(
            ...variantTemplate
              .slice(1)
              .sort(() => 0.5 - Math.random())
              .slice(0, 2)
          );
        }
        const randomTemplates = [...filtered_templates];

        setRandomTemplate(randomTemplates);
        setSelectedTemplateData(editSelectTemplate[0]);
      }
      // Templates Selected Based on New Campaign (campaign-name)
      else {
        if (newCampaignData?.name !== '') {
          setCampaignName(newCampaignData?.name);

          //  Get Filtered Lists of templates bases on campaign name;
          const filtered = templateList?.filter((template) =>
            getCampaignName
              ?.toLowerCase()
              .includes(template.campaign_name?.toLowerCase())
          );

          if (filtered.length > 0 && filtered.length < 2) {
            filtered_templates.push(basicTemplate);
            filtered_templates.push(filtered[0]);
            filtered_templates.push(
              ...variantTemplate
                .slice(1)
                .sort(() => 0.5 - Math.random())
                .slice(0, 1)
            );
          } else {
            filtered_templates.push(basicTemplate);
            filtered_templates.push(
              ...variantTemplate
                .slice(1)
                .sort(() => 0.5 - Math.random())
                .slice(0, 2)
            );
          }
        } else {
          if (newCampaignData?.name === '') {
            filtered_templates.push(basicTemplate);
            filtered_templates.push(
              ...variantTemplate
                .slice(1)
                .sort(() => 0.5 - Math.random())
                .slice(0, 2)
            );
          }
        }
        const randomTemplate = [...filtered_templates];
        setRandomTemplate(randomTemplate);
      }
    }
  }, [templateList, getCampaignName]);


  //  Get Current Subscription Plan Name
  useEffect(() => {
    if (currentTier !== "") {
      setMyPlan(currentTier);
    }

    if (totalCampaigns) {
      setTotalCampaign(totalCampaigns)
    }
  }, [currentTier, totalCampaigns])


  // Get Klaviyo integration Lists from API
  async function getKlaviyoList() {
    try {
      const response = await fetch(`/api/lists`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const list = await response.json();

      setKlaviyoList(list);
    } catch (err) {
      return err;
    }
  }

  // Update Klaviyo API Lists in the Form
  useEffect(() => {
    if (isEdit) {
      if (globalSettings?.klaviyo_api_key !== '') {
        getKlaviyoList();
      }
    } else if (newCampaignData?.klaviyo_api_key !== '') {
      getKlaviyoList();
    } else {
      getKlaviyoList();
    }
  }, [newCampaignData?.klaviyo_api_key, globalSettings?.klaviyo_api_key]);



  //? When user try to reload or change the route to other page
  useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = '';

      return '';
    };

    window.addEventListener('beforeunload', unloadCallback);
    return () => {
      window.removeEventListener('beforeunload', unloadCallback);
    };
  }, []);



  //? Event handling functions

  const ExampleCustomInput = forwardRef(({ value, onClick, onChange }, ref) => (
    <div className='wrapper'>
      <div className='icon'>
        <AiOutlineCalendar
          style={{ height: '20px', width: '20px' }}
          onClick={onClick}
        />
      </div>
      <input
        value={value}
        className='example-custom-input'
        onChange={onChange}
        ref={ref}
      ></input>
    </div>
  ));



  // Display Next Button on each form
  const renderButton = (id) => {
    return (
      <button
        className='nextBtn'
        onClick={() => handleNext(id)}
      >
        Next
      </button>
    );
  };

  // Handle Card Expands and Collapse Events
  const handleExpand = (index) => {
    setExpanded((prevExpand) =>
      prevExpand.map((state, i) => (i === index ? !state : false))
    );
  };

  // Handle Previous Step event for each Form
  const handlePrevious = (index) => {
    setExpanded((prevExpand) =>
      prevExpand.map((state, i) => (i === index ? !state : false))
    );
  };
  // Handle Next Button event for each sub-form section
  const handleNext = (index) => {
    // Edit Campaign Form
    if (isEdit) {
      const isValid = validateForm();
      if (index === 1 && isValid === false) {
        setErrorMessage(true);
        setExpanded((prevExpand) =>
          prevExpand.map((state, i) => i === index - 1 && true)
        );
      } else {
        setErrorName(false);
        setExpanded((prevExpand) =>
          prevExpand.map((state, i) => (i === index ? !state : false))
        );
      }
    }
    // New campaign form 
    else {
      const isValid = validateForm();
      if (index === 1 && isValid === false) {
        setErrorMessage(true);
        setExpanded((prevExpand) =>
          prevExpand.map((state, i) => i === index - 1 && true)
        );
      } else if (index === 1 && newCampaignData.name !== '') {
        if (campaignName.includes(newCampaignData?.name)) {
          setErrorName(true);
          setExpanded((prevExpand) =>
            prevExpand.map((state, i) => i === index - 1 && true)
          );
        } else {
          setErrorMessage(false);
          setErrorName(false);
          setExpanded((prevExpand) =>
            prevExpand.map((state, i) => (i === index ? !state : false))
          );
        }
      }

      else {
        setExpanded((prevExpand) =>
          prevExpand.map((state, i) => (i === index ? !state : false))
        );
      }
    }
  };

  // Handle Discount Codes Validation on Next Button click 
  const handleDiscountValidation = (index) => {
    if (!isEdit) {
      const duplicateTiers = []; // Array to store tier IDs with duplicate discount codes

      const userDiscountCodes = RewardData.map((reward) => {
        const rewardId = reward.id;
        const inputName = `reward_${rewardId}_code`;
        return newCampaignData[inputName];
      });

      // Check Duplicates Discount codes and push the Tiers IDs in duplicateTiers array
      userDiscountCodes?.forEach((code, index) => {
        if (discountList?.includes(code)) {
          duplicateTiers.push(index + 1); // Push the tier ID (index + 1) to the array
        }
      });


      // Step 3: Handle duplicate discount codes
      if (duplicateTiers?.length > 0) {
        // Display error message on the corresponding tiers' cards
        if (duplicateTiers?.includes(1)) {
          setDiscountCode1(true);
          setExpanded((prevExpand) =>
            prevExpand.map((state, i) => i === index - 1 && true)
          );
        } if (duplicateTiers?.includes(2)) {
          setDiscountCode2(true);
          setExpanded((prevExpand) =>
            prevExpand.map((state, i) => i === index - 1 && true)
          );
        } if (duplicateTiers?.includes(3)) {
          setDiscountCode3(true);
          setExpanded((prevExpand) =>
            prevExpand.map((state, i) => i === index - 1 && true)
          );
        } if (duplicateTiers?.includes(4)) {
          setDiscountCode4(true);
          setExpanded((prevExpand) =>
            prevExpand.map((state, i) => i === index - 1 && true)
          );
        }

        return; // Stop further processing
      } else {
        // No Duplicate discount Code
        setDiscountCode1(false);
        setDiscountCode2(false);
        setDiscountCode3(false);
        setDiscountCode4(false);
        // Open Next Form .... and Proceed
        setExpanded((prevExpand) =>
          prevExpand.map((state, i) => (i === index ? !state : false))
        );
      }
    } else {
      setExpanded((prevExpand) =>
        prevExpand.map((state, i) => (i === index ? !state : false))
      );
    }
  }

  // Validation of  Required fields of the Form
  const validateForm = () => {
    const requiredFields = document.querySelectorAll(
      'input[required], select[required]'
    );
    let isFormValid = true;
    requiredFields.forEach((field) => {
      if (!field.value) {
        isFormValid = false;
        setErrorMessage(true);
      } else {
        setErrorMessage(false);
      }
    });
    return isFormValid;
  };

  // Handle input change events

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditCampaignData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setNewCampaignData((prevState) => ({
        ...prevState,
        [name]: value,
      }));

      // value is asynchronic, so it's updated in the next render
      if (e.target.value !== '' && !isLoading) setDraftModal(true);
      else setDraftModal(false);
      if (newCampaignData?.name !== '') setCampaignName(newCampaignData?.name);
    }
  };

  // HandleCheckbox events in the basic form settings

  function handleCheckboxChange(e) {
    const { name, checked } = e.target;

    if (isEdit) {
      setEditCampaignData({ ...editCampaignData, [name]: checked });
    } else {
      setNewCampaignData({ ...newCampaignData, [name]: checked });
    }
  }

  // Handle Radio button Change events

  function handleRadioChange(event) {
    const { name, value } = event.target;
    // Update the state with the new value
    if (isEdit) {
      setEditCampaignData((prevcampaignData) => ({
        ...prevcampaignData,
        collect_phone: value === "phone",
      }));
    } else {
      setNewCampaignData((prevnewcampaignData) => ({
        ...prevnewcampaignData,
        collect_phone: value === "phone",
      }));
    }
  }

  // Handle Discount Type Radio button Change events

  function handleDiscountRadioChange(event) {
    const { name, value } = event.target;
    // Update the state with the new value
    if (isEdit) {
      setEditCampaignData((prevcampaignData) => ({
        ...prevcampaignData,
        discount_type: value,
      }));
    } else {
      setNewCampaignData((prevnewcampaignData) => ({
        ...prevnewcampaignData,
        discount_type: value,
      }));
    }
  }

  // Handle Animation running after integrations settings updated

  function NextClick(index) {
    if (isEdit) {
      setExpanded((prevExpand) =>
        prevExpand.map((state, i) => (i === index ? !state : false))
      );
    } else {
      const loadingOverlay = document.getElementById('loading-overlay');
      loadingOverlay.style.display = 'block';

      setTimeout(function () {
        loadingOverlay.style.display = 'none';
        setExpanded((prevExpand) =>
          prevExpand.map((state, i) => (i === index ? !state : false))
        );
      }, 3700);
    }
  }
  // Handle Template Selection
  async function handleTemplateSelect(template) {
    if (isEdit) {
      setEditCampaignData({
        ...editCampaignData,
        template_id: template?.id,
      });
      setSelectedTemplateData(template);
    } else {
      setNewCampaignData({
        ...newCampaignData,
        template_id: template?.id,
      });
      setSelectedTemplateData(template);
    }
  }


  // Discounts API Call
  async function generateDiscounts(newCampaignData) {
    try {
      const response = await fetch('/api/generate_discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ campaignData: newCampaignData }),
      });
      const responseData = await response.json();
    } catch (error) {
      console.log(error);
    }
  }

  // Template Create API Call 
  async function createTemplates(selectedTemplateData, newCampaignData) {
    try {
      const response = await fetch('/api/create_template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateData: selectedTemplateData,
          campaignData: newCampaignData,
        }),
      });
      const responseData = await response.json();

      return responseData?.data;
    } catch (error) {
      console.log(error);
    }
  }

  // Save Campaign Details in database 
  const saveCampaignDetails = async (campaign_details) => {
    // Send POST Request to save Details From database
    const detailsResponse = await fetch('/api/campaigndetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...campaign_details, is_draft: false, is_active: true }),
    });

    if (detailsResponse.ok) {
      const detailsData = await detailsResponse.json();
    } else {
      console.log('Failed to insert campaign details:', detailsResponse);
    }

  }


  // Save  New Campaign form  & Update Campaign Form
  const handleSaveClick = async (e) => {
    e.preventDefault();
    let idExists;
    let campaignDetails;
    // Editing Camapign Data Form
    if (isEdit) {
      setDraftModal(false);

      await fetch(`/api/campaignsettings/${campaignsid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editCampaignData),
      })
        .then((res) => res.json())
        .then((data) => dispatch(updateCampaign(data)))
        .catch((err) => console.log(err));
      setIsLoading(false);
      setIsEdit(false);
      navigate('/campaigns');
    }
    // Adding A New Campaign and Save in Database
    else {
      setDraftModal(false);

      if (
        newCampaignData?.template_id !== null &&
        selectedTemplateData !== undefined
      ) {
        setIsLoading(true);

        await generateDiscounts(newCampaignData);
        campaignDetails = await createTemplates(selectedTemplateData, newCampaignData);
        console.log(campaignDetails)

        await fetch('/api/campaignsettings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCampaignData),
        })
          .then((res) => res.json())
          .then((data) => {
            dispatch(addNewCampaign(data));
            idExists = data[0]?.campaign_id
          })
          .catch((err) => console.log(err));


      } else {

        return;
      }


      // IF CampaignID Exists the call the saveCampaign details function to store value in db
      if (typeof (idExists) == 'number' && campaignDetails) {
        await saveCampaignDetails(campaignDetails)
      } else {
        console.log("Not saved data")
      }

      setIsLoading(false);
      navigate('/campaigns');
    }
  };

  // Save Draft Campaign data to database
  const handleSaveDraft = async () => {
    if (draftModal === true) {
      await fetch('/api/campaignsettings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCampaignData),
      })
        .then((res) => res.json())
        .then((data) => dispatch(addNewCampaign(data)))
        .catch((err) => console.log(err));
    } else {
      return;
    }
  };

  return (
    <>
      {(myPlan === 'Free' && TotalCampaign > 1 && !isEdit) || (myPlan === 'Tier 1' && TotalCampaign > 2 && !isEdit) ?
        <div className="upgrade-container">
          <p>Upgrade Your Account </p>
          <button className='upgrade-btn' onClick={() => navigate("/price")}>Upgrade Plan</button>
        </div> :
        <div className='new-campaign-container'>
          <div className='newcampaign-title'>
            <h1>{isEdit ? 'Edit Campaign' : 'New Campaign'}</h1>
          </div>

          <SaveDraft
            openModal={showPrompt}
            confirmNavigation={confirmNavigation}
            cancelNavigation={cancelNavigation}
            handleSaveDraft={handleSaveDraft}
          />

          <form onSubmit={handleSaveClick}>
            {/* Basic Settings Input Form Section  */}
            <section className='newcampaign-settings'>
              <div
                className={`basic-form-settings ${expanded[0] ? 'active-card' : 'inactive-card'
                  }`}
                onClick={() => handleExpand(0)}
              >
                <div className='card-header'>
                  <h2 className='card-title'>Basic Settings</h2>
                  <span
                    className='toggle-btn'
                    onClick={() => handleExpand(0)}
                  >
                    {expanded[0] ? (
                      <IoIosArrowUp
                        style={{ strokeWidth: '70', fill: '#fff' }}
                        onClick={() => handleExpand(0)}
                      />
                    ) : (
                      <IoIosArrowDown
                        style={{ strokeWidth: '70', fill: '#fff' }}
                        onClick={() => handleExpand(0)}
                      />
                    )}
                  </span>
                </div>
              </div>
              {expanded[0] && (
                <>
                  <div className='campaign-form'>
                    <div className='input-form-groups'>
                      <div className='form-group'>
                        <div className='inputfield'>
                          <label htmlFor='name'>Campaign Name</label>
                          {isEdit ? (
                            <>
                              <input
                                type='text'
                                name='name'
                                id='name'
                                value={editCampaignData?.name}
                                onChange={handleChange}
                              />{' '}
                              {errorName && (
                                <p className='error-message'>
                                  "Campaign Name already Exists"
                                </p>
                              )}
                            </>
                          ) : (
                            <>
                              <input
                                type='text'
                                name='name'
                                id='name'
                                placeholder='Campaign Name'
                                value={newCampaignData?.name}
                                onChange={handleChange}
                                required
                              />
                              {errorName && (
                                <p className='error-message'>
                                  Campaign Name already Exists
                                </p>
                              )}
                              {errorMessage && (
                                <p className='error-message'>
                                  This field is required
                                </p>
                              )}
                            </>
                          )}
                        </div>

                        <div className='inputfield'>
                          <label htmlFor='product_link'>Product Link</label>
                          {isEdit ? (
                            <div className='select-products'>
                              <select
                                name='product'
                                id='product'
                                value={editCampaignData?.product}
                                onChange={handleChange}
                              >
                                {' '}
                                <option>Select</option>;
                                {productsData?.map((item) => {
                                  return (
                                    <option
                                      value={item.title}
                                      key={item.id}
                                    >
                                      {item.title}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          ) : (
                            <div className='select-products'>
                              <select
                                name='product'
                                id='product'
                                placeholder='T-Shirts'
                                value={newCampaignData?.product}
                                onChange={handleChange}
                              >
                                {' '}
                                <option>Select</option>;
                                {productsData?.map((item) => {
                                  return (
                                    <option
                                      value={item.title}
                                      key={item.id}
                                    >
                                      {item.title}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className='form-group'>
                        <div className='inputfield'>
                          <label htmlFor='start_date'>Start Date</label>

                          {isEdit ? (
                            <DatePicker
                              minDate={new Date()}
                              showDisabledMonthNavigation
                              customInput={<ExampleCustomInput />}
                              shouldCloseOnSelect={true}
                              selected={
                                editCampaignData?.start_date
                                  ? new Date(editCampaignData.start_date)
                                  : null
                              }
                              value={
                                editCampaignData?.start_date
                                  ? new Date(editCampaignData.start_date)
                                  : null
                              }
                              onChange={(date) =>
                                setEditCampaignData((prev) => ({
                                  ...prev,
                                  ['start_date']: date,
                                }))
                              }
                            />
                          ) : (
                            <DatePicker
                              name='start_date'
                              minDate={new Date()}
                              showDisabledMonthNavigation
                              customInput={<ExampleCustomInput />}
                              shouldCloseOnSelect={true}
                              selected={newCampaignData?.start_date}
                              value={newCampaignData?.start_date}
                              onChange={(date) =>
                                setNewCampaignData((prev) => ({
                                  ...prev,
                                  ['start_date']: date,
                                }))
                              }
                            />
                          )}
                        </div>

                        <div className='inputfield'>
                          <label htmlFor='end_date'>End Date</label>
                          {isEdit ? (
                            <DatePicker
                              minDate={new Date()}
                              customInput={<ExampleCustomInput />}
                              showDisabledMonthNavigation
                              shouldCloseOnSelect={true}
                              selected={
                                editCampaignData?.end_date
                                  ? new Date(editCampaignData.end_date)
                                  : null
                              }
                              value={
                                editCampaignData?.end_date
                                  ? new Date(editCampaignData.end_date)
                                  : null
                              }
                              onChange={(date) =>
                                setEditCampaignData((prev) => ({
                                  ...prev,
                                  ['end_date']: date,
                                }))
                              }
                            />
                          ) : (
                            <DatePicker
                              name='end_date'
                              minDate={new Date()}
                              customInput={<ExampleCustomInput />}
                              showDisabledMonthNavigation
                              shouldCloseOnSelect={true}
                              selected={newCampaignData?.end_date}
                              value={newCampaignData?.end_date}
                              onChange={(date) =>
                                setNewCampaignData((prev) => ({
                                  ...prev,
                                  ['end_date']: date,
                                }))
                              }
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Store's Social Links */}
                    <div className='store-links'>
                      <h2 className='sub-heading'>
                        Share Store's Social Media Links
                      </h2>
                      <div className='store-social-links'>
                        {storeLinks.map((link) => (
                          <div
                            className='social-input-form'
                            key={link.id}
                          >
                            {isEdit ? (
                              <input
                                className='social-input'
                                type='checkbox'
                                name={`show_${link?.name}`}
                                checked={
                                  editCampaignData !== undefined
                                    ? editCampaignData[`show_${link?.name}`]
                                    : null
                                }
                                onChange={handleCheckboxChange}
                              />
                            ) : (
                              <input
                                className='social-input'
                                type='checkbox'
                                name={`show_${link?.name}`}
                                checked={newCampaignData[`show_${link?.name}`]}
                                onChange={handleCheckboxChange}
                              />
                            )}
                            <span className='store-social-icons'>{link.icon}</span>
                            {isEdit ? (
                              <input
                                className='social-inputfield'
                                type='text'
                                name={`${link?.name}`}
                                value={editCampaignData[`${link?.name}`]}
                                onChange={handleChange}
                              />
                            ) : (
                              <input
                                className='social-inputfield'
                                type='text'
                                name={`${link?.name}`}
                                value={newCampaignData[`${link?.name}`]}
                                onChange={handleChange}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className='collect-setup'>
                      <div className='collect-settings'>
                        <h2 className='sub-heading'>Collect</h2>

                        <div>
                          {isEdit ? (
                            <input
                              className='checkbox-input'
                              type='radio'
                              name='collect_phone'
                              value='phone'
                              checked={editCampaignData?.collect_phone === true}
                              onChange={handleRadioChange}
                            />
                          ) : (
                            <input
                              className='checkbox-input'
                              type='radio'
                              name='collect_phone'
                              value='phone'
                              checked={newCampaignData?.collect_phone === true}
                              onChange={handleRadioChange}
                            />
                          )}
                          <label htmlFor='collect_phone'>
                            Email Addresses and Phone Numbers{' '}
                          </label>
                        </div>
                        <div>
                          {isEdit ? (
                            <input
                              className='checkbox-input'
                              type='radio'
                              name='collect_phone'
                              value='email'
                              checked={editCampaignData?.collect_phone === false}
                              onChange={handleRadioChange}
                            />
                          ) : (
                            <input
                              className='checkbox-input'
                              type='radio'
                              name='collect_phone'
                              value='email'
                              checked={newCampaignData?.collect_phone === false}
                              onChange={handleRadioChange}
                            />
                          )}
                          <label htmlFor='collect_phone'>
                            Email Addresses only
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='next-btn-toggle'>{renderButton(1)}</div>
                </>
              )}
            </section>

            {/* Referal Settings */}
            <section className='newcampaign-settings'>
              <div
                className={`referrals-settings ${expanded[1] ? 'active-card' : 'inactive-card'
                  }`}
              //  onClick={() => handleExpand(1)}
              >
                <div className='card-header'>
                  <h2 className='card-title'>Referral Settings</h2>
                  <span
                    className='toggle-btn'
                  // onClick={() => handleExpand(1)}
                  >
                    {expanded[1] ? (
                      <IoIosArrowUp
                        style={{ strokeWidth: '70', fill: '#fff' }}
                        onClick={() => handleExpand(1)}
                      />
                    ) : (
                      <IoIosArrowDown
                        style={{ strokeWidth: '70', fill: '#fff' }}
                      // onClick={() => handleExpand(1)}
                      />
                    )}
                  </span>
                </div>
              </div>

              {expanded[1] && (
                <>
                  <div className='referral-settings-form'>
                    <div className='referral-container'>
                      <p>
                        Select the Social Media channels that you want to allow your
                        customers to share their referral link with!
                        <br /> You can also customise the message that you would
                        want your customers to share!
                      </p>
                    </div>
                    <div className='social-links-container'>
                      {integratelinks?.map((link) => (
                        <div
                          className='social_block'
                          key={link?.id}
                        >
                          <div className='social-section'>
                            <div className='social-title'>
                              <span className='social-icons'>{link?.icon}</span>
                            </div>

                            <div className='check-input'>
                              {isEdit ? (
                                <input
                                  type='checkbox'
                                  name={`share_${link?.title}_referral`}
                                  id={`share_${link?.title}_referral`}
                                  checked={
                                    editCampaignData[
                                    `share_${link?.title}_referral`
                                    ]
                                  }
                                  onChange={handleCheckboxChange}
                                />
                              ) : (
                                <input
                                  type='checkbox'
                                  name={`share_${link?.title}_referral`}
                                  id={`share_${link?.title}_referral`}
                                  checked={
                                    newCampaignData[`share_${link?.title}_referral`]
                                  }
                                  onChange={handleCheckboxChange}
                                />
                              )}{' '}
                              <label htmlFor=''>{link?.desc}</label>
                            </div>

                            <div className='referral-link-input'>
                              {isEdit ? (
                                <textarea
                                  className='referral-input'
                                  name={`share_${link?.title}_message`}
                                  rows={4}
                                  value={
                                    editCampaignData[`share_${link?.title}_message`]
                                  }
                                  onChange={handleChange}
                                />
                              ) : (
                                <textarea
                                  className='referral-input'
                                  name={`share_${link?.title}_message`}
                                  rows={4}
                                  value={
                                    newCampaignData[`share_${link?.title}_message`]
                                  }
                                  onChange={handleChange}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='referral-nextbtn'>
                    <>
                      <button
                        className='prevBtn'
                        onClick={() => handlePrevious(0)}
                      >
                        Previous
                      </button>
                      <button
                        className='nextBtn'
                        onClick={() => handleNext(2)}
                      >
                        Next
                      </button>
                    </>
                  </div>
                </>
              )}
            </section>

            {/* Reward Settings */}

            <section className='newcampaign-settings'>
              <div
                className={`rewards-settings ${expanded[2] ? 'active-card' : 'inactive-card'
                  }`}
              // onClick={() => handleExpand(2)}
              >
                <div className='card-header'>
                  <h2 className='card-title'>Reward Settings</h2>
                  <span
                    className='toggle-btn'
                  // onClick={() => handleExpand(2)}
                  >
                    {expanded[2] ? (
                      <IoIosArrowUp
                        style={{ strokeWidth: '70', fill: '#fff' }}
                        onClick={() => handleExpand(2)}
                      />
                    ) : (
                      <IoIosArrowDown
                        style={{ strokeWidth: '70', fill: '#fff' }}
                      // onClick={() => handleExpand(2)}
                      />
                    )}
                  </span>
                </div>
              </div>

              {expanded[2] && (
                <>
                  <div className='rewards-settings-form'>
                    <p>
                      Set up the Rewards for your customers here! Select the
                      discount type and then the reward tiers!
                    </p>
                    <p>
                      Note: Discount will not be applicable on Shipping. Each code
                      can be used by a customer only once.
                    </p>

                    <div className='rewards-settings-container'>
                      <h2 className='sub-heading'>Discount</h2>
                      <div className='discount-settings'>
                        {error ? (
                          <p className='error-message'>Select the Discount Type</p>
                        ) : null}

                        <div>
                          {isEdit ? (
                            <input
                              className='social-radioInput'
                              type='radio'
                              name='discount_type'
                              value='percent'
                              checked={
                                editCampaignData?.discount_type === 'percent'
                              }
                              onChange={handleDiscountRadioChange}
                            />
                          ) : (
                            <input
                              className="social-radioInput"
                              type="radio"
                              name="discount_type"
                              value="percent"
                              checked={newCampaignData?.discount_type === "percent"}
                              onChange={handleDiscountRadioChange}
                            />
                          )}
                          <label htmlFor=''>% off the entire order</label>
                        </div>
                        <div>
                          {isEdit ? (
                            <input
                              className="social-radioInput"
                              type="radio"
                              name="discount_type"
                              value="amount"
                              checked={editCampaignData?.discount_type === "amount"}
                              onChange={handleDiscountRadioChange}
                            />
                          ) : (
                            <input
                              className="social-radioInput"
                              type="radio"
                              name="discount_type"
                              value="amount"
                              checked={newCampaignData?.discount_type === "amount"}
                              onChange={handleDiscountRadioChange}
                            />
                          )}{' '}
                          <label htmlFor=''>$ off the entire order</label>
                        </div>
                      </div>
                    </div>

                    <div className='rewards-container'>
                      {RewardData.map((reward) => (
                        <div
                          key={reward.id}
                          className='reward-card'
                        >
                          <div classname='reward-tier-card'>
                            <div className='reward-title'>
                              <h2>{reward.title}</h2>
                              <span>
                                {' '}
                                {reward.is_required === true && '(Required)'}
                              </span>
                            </div>
                            <div className='reward-content'>
                              <div className='reward-form'>
                                <div className='inputfield'>
                                  <label htmlFor={`reward_${reward?.id}_tier`}>
                                    No of Referrals
                                  </label>
                                  {isEdit ? (
                                    <input
                                      className='small-inputfield'
                                      type='number'
                                      name={`reward_${reward?.id}_tier`}
                                      value={editCampaignData[`reward_${reward?.id}_tier`]}
                                      onChange={handleChange}
                                      disabled={isEdit}
                                    />
                                  ) : (
                                    <input
                                      className='small-inputfield'
                                      type='number'
                                      name={`reward_${reward?.id}_tier`}
                                      value={newCampaignData[`reward_${reward?.id}_tier`]}
                                      onChange={handleChange}
                                      disabled={reward?.id > 1 && !newCampaignData[`reward_${reward?.id - 1}_tier`]}
                                    />
                                  )}
                                </div>
                                <div className='inputfield'>
                                  <label htmlFor={`reward_${reward?.id}_discount`}>
                                    Discount
                                  </label>
                                  {isEdit ? (
                                    <input
                                      className='small-inputfield'
                                      type='number'
                                      name={`reward_${reward?.id}_discount`}
                                      value={editCampaignData[`reward_${reward?.id}_discount`]}
                                      onChange={handleChange}
                                      disabled={isEdit}
                                    />
                                  ) : (
                                    <input
                                      className='small-inputfield'
                                      type='number'
                                      name={`reward_${reward?.id}_discount`}
                                      value={newCampaignData[`reward_${reward?.id}_discount`]}
                                      onChange={handleChange}
                                      disabled={reward?.id > 1 && !newCampaignData[`reward_${reward?.id - 1}_discount`]}
                                    />
                                  )}
                                </div>
                                <div className='inputfield'>
                                  <label htmlFor={`reward_${reward?.id}_code`}>
                                    Discount Code
                                  </label>
                                  {isEdit ? (
                                    <input
                                      className='large-field'
                                      type='text'
                                      name={`reward_${reward?.id}_code`}
                                      value={editCampaignData[`reward_${reward?.id}_code`]}
                                      onChange={handleChange}
                                      disabled={isEdit}
                                    />
                                  ) : (
                                    <input
                                      className='large-field'
                                      type='text'
                                      name={`reward_${reward?.id}_code`}
                                      value={newCampaignData[`reward_${reward?.id}_code`]}
                                      onChange={handleChange}
                                      disabled={reward?.id > 1 && !newCampaignData[`reward_${reward?.id - 1}_code`]}
                                    />
                                  )}
                                </div>

                              </div>
                              <div>

                                {discountCode1 === true && reward?.id === 1 && <h6 className='discount_error_text'>{`Discount Code for Tier ${reward?.id} Already Exists`}</h6>}
                                {discountCode2 === true && reward?.id === 2 && <h6 className='discount_error_text'>{`Discount Code for Tier ${reward?.id} Already Exists`}</h6>}
                                {discountCode3 === true && reward?.id === 3 && <h6 className='discount_error_text'>{`Discount Code for Tier ${reward?.id} Already Exists`}</h6>}
                                {discountCode4 === true && reward?.id === 4 && <h6 className='discount_error_text'>{`Discount Code for Tier ${reward?.id} Already Exists`}</h6>}

                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className='reward-section'>
                    <>
                      <button
                        className='prevBtn'
                        onClick={() => handlePrevious(1)}
                      >
                        Previous
                      </button>
                      <button
                        className='nextBtn'
                        onClick={() => handleDiscountValidation(3)}
                      >
                        Next
                      </button>
                    </>
                  </div>
                </>
              )}
            </section>

            {/* Email Settings */}
            <section className='newcampaign-settings'>
              <div
                className={`emails-settings ${expanded[3] ? 'active-card' : 'inactive-card'
                  }`}
              // onClick={() => handleExpand(3)}
              >
                <div className='card-header'>
                  <h2 className='card-title'>Email Settings</h2>
                  <span
                    className='toggle-btn'
                  // onClick={() => handleExpand(3)}
                  >
                    {expanded[3] ? (
                      <IoIosArrowUp
                        style={{ strokeWidth: '70', fill: '#fff' }}
                        onClick={() => handleExpand(3)}
                      />
                    ) : (
                      <IoIosArrowDown
                        style={{ strokeWidth: '70', fill: '#fff' }}
                      // onClick={() => handleExpand(3)}
                      />
                    )}
                  </span>
                </div>
              </div>
              {expanded[3] && (
                <>
                  <div className='email-container'>
                    <div className='email-optCheck'>
                      {isEdit ? (
                        <input
                          className='checkbox-input'
                          type='checkbox'
                          name='double_opt_in'
                          id='double_opt_in'
                          checked={editCampaignData?.double_opt_in}
                          onChange={handleCheckboxChange}
                        />
                      ) : (
                        <input
                          className='checkbox-input'
                          type='checkbox'
                          name='double_opt_in'
                          id='double_opt_in'
                          checked={newCampaignData?.double_opt_in}
                          onChange={handleCheckboxChange}
                        />
                      )}
                      <label htmlFor='double_opt_in'>
                        Enable Double Opt in for new sign-ups (This feature requires
                        Professional Plan or above)
                      </label>
                    </div>
                    <section>
                      <div className='email-section'>
                        <h2>Email Settings - Double Opt-in Email </h2>
                        <div className='email-content'>
                          <img
                            src={BlackLogo}
                            alt='Shop Logo'
                            className='shop-logo'
                          />

                          {isEdit ? (
                            <textarea
                              className='email-textinput'
                              type='text'
                              rows={9}
                              value={editCampaignData?.double_opt_in_email}
                              name='double_opt_in_email'
                              id='double_opt_in_email'
                              onChange={handleChange}
                            />
                          ) : (
                            <textarea
                              className='email-textinput'
                              type='text'
                              rows={9}
                              value={newCampaignData?.double_opt_in_email}
                              name='double_opt_in_email'
                              id='double_opt_in_email'
                              onChange={handleChange}
                            />
                          )}
                        </div>
                      </div>
                    </section>
                    <section>
                      <div className='email-section'>
                        <h2>
                          Welcome Email Draft - This email is sent when a customer
                          signs up{' '}
                        </h2>
                        <div className='email-content'>
                          <img
                            src={BlackLogo}
                            alt='Shop Logo'
                            className='shop-logo'
                          />

                          {isEdit ? (
                            <textarea
                              className='email-textinput'
                              rows={9}
                              value={editCampaignData?.welcome_email}
                              name='welcome_email'
                              id='welcome_email'
                              onChange={handleChange}
                            />
                          ) : (
                            <textarea
                              className='email-textinput'
                              rows={9}
                              value={newCampaignData?.welcome_email}
                              name='welcome_email'
                              id='welcome_email'
                              onChange={handleChange}
                            />
                          )}
                        </div>
                      </div>
                    </section>
                    <section>
                      <div className='email-section'>
                        <h2>
                          Referral Email Draft - This email is sent when a referral
                          signs up{' '}
                        </h2>
                        <div className='email-content'>
                          <img
                            src={BlackLogo}
                            alt='Shop Logo'
                            className='shop-logo'
                          />

                          {isEdit ? (
                            <textarea
                              className='email-textinput'
                              rows={9}
                              name='referral_email'
                              value={editCampaignData?.referral_email}
                              onChange={handleChange}
                            />
                          ) : (
                            <textarea
                              className='email-textinput'
                              rows={9}
                              name='referral_email'
                              value={newCampaignData?.referral_email}
                              onChange={handleChange}
                            />
                          )}
                        </div>
                      </div>
                    </section>
                    <section>
                      <div className='email-section'>
                        <h2>
                          Reward Tier Email Draft - This email is sent when a reward
                          tier is unlocked
                        </h2>
                        <div className='email-content'>
                          <img
                            src={BlackLogo}
                            alt='Shop Logo'
                            className='shop-logo'
                          />

                          {isEdit ? (
                            <textarea
                              className='email-textinput'
                              rows={9}
                              name='reward_email'
                              value={editCampaignData?.reward_email}
                              onChange={handleChange}
                            />
                          ) : (
                            <textarea
                              className='email-textinput'
                              rows={9}
                              name='reward_email'
                              value={newCampaignData?.reward_email}
                              onChange={handleChange}
                            />
                          )}
                        </div>
                      </div>
                    </section>
                  </div>
                  <div className='email-setting-section'>
                    <>
                      <button
                        className='prevBtn'
                        onClick={() => handlePrevious(2)}
                      >
                        Previous
                      </button>
                      <button
                        className='nextBtn'
                        onClick={() => handleNext(4)}
                      >
                        Next
                      </button>
                    </>
                  </div>
                </>
              )}
            </section>

            {/* Integration Settings */}

            <section className='newcampaign-settings'>
              <div
                className={`integration-settings ${expanded[4] ? 'active-card' : 'inactive-card'
                  }`}
              >
                <div className='card-header'>
                  <h2 className='card-title'>Integration Settings</h2>
                  <span className='toggle-btn'>
                    {expanded[4] ? (
                      <IoIosArrowUp
                        style={{ strokeWidth: '70', fill: '#fff' }}
                        onClick={() => handleExpand(4)}
                      />
                    ) : (
                      <IoIosArrowDown style={{ strokeWidth: '70', fill: '#fff' }} />
                    )}
                  </span>
                </div>
              </div>

              {expanded[4] && (
                <>
                  <div className='integration-container'>
                    <div className='integration-block-content'>
                      <div className='check-input'>
                        {isEdit ? (
                          <input
                            type='checkbox'
                            name='klaviyo_integration'
                            checked={editCampaignData?.klaviyo_integration}
                            onChange={handleCheckboxChange}
                          />
                        ) : (
                          <input
                            type='checkbox'
                            name='klaviyo_integration'
                            checked={newCampaignData?.klaviyo_integration}
                            onChange={handleCheckboxChange}
                          />
                        )}
                        <label htmlFor='klaviyo_integration'>
                          Integrate with Klaviyo
                        </label>
                      </div>

                      <div className='integration-settings-container'>
                        <div className='form-group'>
                          <div className='inputfield'>
                            <label htmlFor='klaviyo_api_key'>Private API Key</label>
                            {isEdit ? (
                              <input
                                type='text'
                                className='disabled-value'
                                name='klaviyo_api_key'
                                id='klaviyo_api_key'
                                placeholder='Enter API Key'
                                value={globalSettings?.klaviyo_api_key}
                                onChange={handleChange}
                                disabled
                              />
                            ) : (
                              <input
                                className='disabled-value'
                                type='text'
                                name='klaviyo_api_key'
                                id='klaviyo_api_key'
                                placeholder='Enter API Key'
                                value={newCampaignData?.klaviyo_api_key}
                                onChange={handleChange}
                                disabled
                              />
                            )}
                          </div>
                        </div>
                        <div className='form-group'>
                          <div className='inputfield'>
                            {klaviyoList?.length > 2 && (
                              <label htmlFor=''>List to Add Users</label>
                            )}

                            {klaviyoList?.length > 2 ? (
                              <div className='select-user-input'>
                                {isEdit ? (
                                  <select
                                    name='klaviyo_list_id'
                                    id='klaviyo_list_id'
                                    value={editCampaignData?.klaviyo_list_id}
                                    onChange={handleChange}
                                  >
                                    <option value='Select'>Select</option>
                                    {klaviyoList?.map((list) => (
                                      <option
                                        key={list?.list_id}
                                        value={list?.list_id}
                                      >
                                        {list?.list_name}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <select
                                    name='klaviyo_list_id'
                                    id='klaviyo_list_id'
                                    value={newCampaignData?.klaviyo_list_id}
                                    onChange={handleChange}
                                  >
                                    <option value='Select'>Select</option>
                                    {klaviyoList?.map((list) => (
                                      <option
                                        key={list?.list_id}
                                        value={list?.list_id}
                                      >
                                        {list?.list_name}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </div>
                            ) : (
                              <Link to='/settings'>
                                <p className='klaviyo-message'>
                                  {klaviyoList?.message}
                                </p>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='integrate-setting-btn'>
                    <>
                      <button
                        className='prevBtn'
                        onClick={() => handlePrevious(3)}
                      >
                        Previous
                      </button>
                      <button
                        className='nextBtn'
                        onClick={() => NextClick(5)}
                      >
                        Next
                      </button>
                    </>
                  </div>
                </>
              )}
            </section>

            {/* Template Settings */}

            <section className='newcampaign-settings'>
              <div
                className={`template-settings ${expanded[5] ? 'active-card' : 'inactive-card'
                  }`}
              >
                <div className='card-header'>
                  <h2 className='card-title'>Template Settings</h2>
                  <span className='toggle-btn'>
                    {expanded[5] ? (
                      <IoIosArrowUp
                        style={{ strokeWidth: '70', fill: '#fff' }}
                        onClick={() => handleExpand(5)}
                      />
                    ) : (
                      <IoIosArrowDown style={{ strokeWidth: '70', fill: '#fff' }} />
                    )}
                  </span>
                </div>
              </div>

              {expanded[5] && (
                <>
                  <div className='template-container'>
                    <div className='template-content'>
                      <p>Select one of the following specially curated template</p>
                    </div>
                    <div className='templates-block-container'>
                      <div className='template-cards'>
                        {randomTemplate?.map((template, index) => (
                          <div
                            key={template?.id}
                            className={
                              selectedTemplateData?.id === template?.id
                                ? 'template-card-block selected'
                                : 'template-card-block'
                            }
                            onClick={() => handleTemplateSelect(template)}
                            disabled={isEdit}
                          >
                            {template?.id === 1 ? (
                              <h3>
                                Build a custom template in the Shopify Theme Editor{' '}
                              </h3>
                            ) : (
                              template?.id > 1 && <img key={template?.id} src={template?.landing_welcome_image_url} alt={template?.campaign_name} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className='laststep'>
                      <p>
                        After the Campaign is created, you will be navigated to Campaigns Table
                        Where You can Edit or Finalize Your Campaigns Settings.
                      </p>
                    </div>
                  </div>
                  <div className='template-end'>
                    <>
                      <button
                        className='prevBtn'
                        onClick={() => handlePrevious(4)}
                      >
                        Previous
                      </button>
                      <button
                        className='saveFormBtn'
                        type='submit'
                        disabled={isLoading}
                      >
                        {isEdit ? (
                          <>{isLoading ? 'Updating...' : 'Update Campaign'}</>
                        ) : (
                          <>{isLoading ? 'Creating...' : 'Create Campaign'}</>
                        )}
                      </button>


                    </>
                  </div>
                </>
              )}
            </section>
          </form>

          {/* Loading Animation  */}
          <div id='loading-overlay'>
            <div id='loading-spinner'>
              <h2>Setting Up the best templates for your campaigns</h2>
              <img
                src={anime}
                alt='image'
              />
            </div>
          </div>
        </div>

      }
    </>
  );
}

export default NewCampaignForm;