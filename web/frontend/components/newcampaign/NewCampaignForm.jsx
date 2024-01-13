import React, {
  useState,
  forwardRef,
  useEffect,
  useRef,
  Suspense,
  lazy,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { anime, BlackLogo } from "../../assets/index";
import { AiOutlineCalendar } from "react-icons/ai";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { MdError } from "react-icons/md";
import { integratelinks } from "./socialLinks";
import { useStateContext } from "../../contexts/ContextProvider";
import "./newcampaign.css";
import { useDispatch, useSelector } from "react-redux";
import "./socialsBlocks/social.css";
import "./rewardTier/RewardTier.css";
import {
  fetchCampaignByName,
  addNewCampaign,
} from "../../app/features/campaigns/campaignSlice";
import { storeLinks } from "./dummySocial";
import { RewardData } from "./rewardTier/RewardData";
import { useAuthenticatedFetch } from "../../hooks";
import { fetchAllSettings } from "../../app/features/settings/settingsSlice";
import { fetchAllProducts } from "../../app/features/productSlice";
import useFetchTemplates from "../../constant/fetchTemplates";
import { useCallbackPrompt } from "../../hooks/useNavigatingPrompt";
import {
  fetchCurrentPlan,
  fetchCurrentTier,
} from "../../app/features/current_plan/current_plan";
import {
  addNewCampaignDetails,
  fetchCampaignDetails,
  fetchCampaignDetailsById,
  fetchCampaignsDetailsList,
  fetchCampaignsDiscountCodes,
  fetchCampaignsProuctsList,
  getActiveCampaigns,
} from "../../app/features/campaign_details/campaign_details";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useFetchDiscountCodes from "../../constant/fetchDiscountCodes";

const SaveDraft = lazy(() => import("../modal/SaveDraft"));

function NewCampaignForm() {
  const toastId = useRef(null);
  const abortController = new AbortController();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { campaignsid } = useParams();
  const { isEdit, setIsEdit, formErrors, SetFormErrors } = useStateContext();
  const fetch = useAuthenticatedFetch(); //Fetch Campaign data with authenticated credentials

  // Get Values from Redux-Store
  const fetchCampaign = useSelector(fetchCampaignsDetailsList); // To Get Campaigns Reward Codes List
  const campaignName = useSelector(fetchCampaignByName); //Get the Campaign Name to verify unique campaign name
  const campaignsDiscountCode = useSelector(fetchCampaignsDiscountCodes);
  const settings = useSelector(fetchAllSettings); //Settings Data
  const products = useSelector(fetchAllProducts); //Get all products of Shop
  const totalCampaigns = useSelector(getActiveCampaigns);
  const campaignsProductlist = useSelector(fetchCampaignsProuctsList);
  const currentTier = useSelector(fetchCurrentTier);
  const current_plan = useSelector(fetchCurrentPlan);
  const campaignById = useSelector(
    (state) => fetchCampaignDetailsById(state, Number(campaignsid)) // Get A Single Campaign with ID
  );

  // Get Tomorrow Date and  Date for next 6 days for the Campaign End Date
  let today = new Date();
  let getStartDate = new Date();
  let getNextDate = new Date();
  getStartDate.setDate(today.getDate() + 1); // Get Start Date
  getNextDate.setDate(today.getDate() + 6); //Get End Date
  getStartDate.setHours(0, 1, 0, 0); // Set to 00:01 AM
  getNextDate.setHours(23, 59, 59, 999); // Set to 11:59 PM

  // Local States of Components

  const [apiError, setApiError] = useState(false);
  const [editCampaignData, setEditCampaignData] = useState({});
  const [excludeEditCampaignName, setExcludeEditCampaignName] = useState([]);
  const [discountList, setDiscountList] = useState([]);
  const [globalSettings, setGlobalSettings] = useState({});
  const [getProducts, setProducts] = useState({
    filteredTierProducts: [],
    productsList: [],
  });
  const [draftModal, setDraftModal] = useState(false);
  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(draftModal);
  const [updateCampaignData, setUpdateCampaignData] = useState({});
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
  const [myPlan, setMyPlan] = useState("");
  const [TotalCampaign, setTotalCampaign] = useState();
  const [selectProducts, setSelectProducts] = useState({
    launchProductId: null,
    launchProductTitle: "",
    tier1ProductName: "",
    tier1ProductId: null,
    tier2ProductName: "",
    tier2ProductId: null,
    tier3ProductName: "",
    tier3ProductId: null,
    tier4ProductName: "",
    tier4ProductId: null,
    reward_email_template: `Hi there,

    Congratulations! You have unlocked a free product reward at {campaign.name}. 
    You can invite more friends and family to join you in collecting more rewards products by using {referral_link}.
    
    So far, {referral_count} friends have joined using your referral link. You can get {tier_1_product_title} for free that will be automatically added to your cart if you purchase our launch product {launch_product_title}. 
    
    We are super excited to see you winning!!
    
    {shop_name}`,
  }); // Get the product ID from Selected Product Title in New campaign Form
  const [isReward2Error, setIsReward2Error] = useState(false);
  const [isReward3Error, setIsReward3Error] = useState(false);
  const [isReward4Error, setIsReward4Error] = useState(false);
  const [discountCode1, setDiscountCode1] = useState(false);
  const [discountCode2, setDiscountCode2] = useState(false);
  const [discountCode3, setDiscountCode3] = useState(false);
  const [discountCode4, setDiscountCode4] = useState(false);
  const [rewardTierValidate, setRewardTierValidate] = useState(false);
  const [discountInvalidError, setDiscountInvalidError] = useState(false); // To Get Validation error for Duplicate codes on Store

  //? New Campaign Form Data Fields
  const [newCampaignData, setNewCampaignData] = useState({
    collect_phone: globalSettings?.collect_phone,
    discord_link: globalSettings?.discord_link,
    double_opt_in: globalSettings?.double_opt_in,
    double_opt_in_email: globalSettings?.double_opt_in_email,
    end_date: getNextDate,
    facebook_link: globalSettings?.facebook_link,
    instagram_link: globalSettings?.instagram_link,
    klaviyo_integration: globalSettings?.klaviyo_integration,
    klaviyo_list_id: "",
    name: "",
    product: "",
    klaviyo_api_key: globalSettings?.klaviyo_api_key,
    referral_email: globalSettings?.referral_email,
    reward_1_code: globalSettings?.reward_1_code,
    reward_1_discount: globalSettings?.reward_1_discount,
    reward_1_tier: globalSettings?.reward_1_tier,
    reward_1_product: "",
    reward_2_code: globalSettings?.reward_2_code,
    reward_2_product: "",
    reward_2_discount: globalSettings?.reward_2_discount,
    reward_2_tier: globalSettings?.reward_2_tier,
    reward_3_code: globalSettings?.reward_3_code,
    reward_3_product: "",
    reward_3_discount: globalSettings?.reward_3_discount,
    reward_3_tier: globalSettings?.reward_3_tier,
    reward_4_code: globalSettings?.reward_4_code,
    reward_4_discount: globalSettings?.reward_4_discount,
    reward_4_tier: globalSettings?.reward_4_tier,
    reward_4_product: "",
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
    start_date: getStartDate,
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

  const { data: fetchDiscountCodes, error: fetchDiscountCodesError } =
    useFetchDiscountCodes("/api/fetch_discount_codes", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: abortController.signal,
    });


  useEffect(() => {
    if (fetchDiscountCodes?.length > 0) {
      setDiscountList([...discountList, ...fetchDiscountCodes]);
    }
    return () => {
      abortController.abort();
    };
  }, [fetchDiscountCodes]);

  // Get All Campaigns Discount Code List
  useEffect(() => {
    if (campaignsDiscountCode?.length > 0) {
      // Use Set to remove duplicates and convert back to an array
      let uniqueCodes = [...new Set(campaignsDiscountCode)];

      let codesList = [...uniqueCodes, ...discountList];
      setDiscountList([...new Set(codesList)]);
    }

    // Get All Campaigns Discount Code
    if (fetchCampaign?.length > 0) {
      let codesList = [];
      fetchCampaign.forEach((campaign) => {
        codesList.push(campaign?.reward_1_code);
        codesList.push(campaign?.reward_2_code);
        codesList.push(campaign?.reward_3_code);
        codesList.push(campaign?.reward_4_code);
      });

      let uniqueList = codesList?.filter((code) => code !== null);

      let uniqudiscounts = [...uniqueList, ...discountList];
      setDiscountList([...new Set(uniqudiscounts)]);
    }
  }, [campaignsDiscountCode, fetchCampaign]);

  let draftCampaignName = campaignById?.name;
  // Get the Data with Campaigns ID for Edit campaign
  useEffect(() => {
    if (campaignById != {} || campaignById != undefined) {
      setEditCampaignData({
        ...campaignById,
        reward_1_product: campaignById?.tier1_product_name,
        reward_2_product: campaignById?.tier2_product_name,
        reward_3_product: campaignById?.tier3_product_name,
        reward_4_product: campaignById?.tier4_product_name,
        start_date: getStartDate,
        end_date: getNextDate,
      });
      draftCampaignName = campaignById?.name;
    }
  }, [campaignById]);

  let excludeProducts = [
    campaignById?.tier1_product_name,
    campaignById?.tier2_product_name,
    campaignById?.tier3_product_name,
    campaignById?.tier4_product_name,
  ];
  //! Re-render all the global settings fields into the Form
  useEffect(() => {
    if (settings !== undefined) {
      setGlobalSettings({ ...settings });
    }
  }, [settings]);

  // get the Products in select box
  useEffect(() => {
    if (products?.length > 0) {
      let NewProducts = products?.filter(
        (product) => !campaignsProductlist.includes(product?.title)
      );
      setProducts((prevList) => ({
        ...prevList,
        productsList: [...NewProducts],
      }));
    }
  }, [products, campaignsProductlist]);

  // Get New Campaign Form pre-filled fields From Global Settings
  useEffect(() => {
    if (globalSettings !== undefined) {
      setNewCampaignData((prevState) => ({
        ...prevState,
        ...globalSettings,
      }));
    }
  }, [globalSettings]);

  useEffect(() => {
    // Set initial state based on isEdit and current_plan.collecting_phone
    if (isEdit) {
      setNewCampaignData((prevCampaign) => ({
        ...prevCampaign,
        collect_phone: current_plan?.collecting_phone || false,
      }));
    } else {
      setNewCampaignData((prevCampaign) => ({
        ...prevCampaign,
        collect_phone: current_plan?.collecting_phone
          ? globalSettings?.collect_phone
          : false, // Default value for new form when editing
      }));
    }
  }, [isEdit, current_plan, globalSettings]);

  // Fetch Templates Data from API
  const templateData = useFetchTemplates("/api/templates", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    signal: abortController.signal,
  });
  // if Fetch result is successful store the result in templateList

  useEffect(() => {
    if (templateData?.length > 0) {
      setTemplateList(templateData);
    }
    return () => {
      abortController.abort();
    };
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
        if (newCampaignData?.name !== "") {
          setCampaignName(newCampaignData?.name);

          //  Get Filtered Lists of templates bases on campaign name;
          const filtered = templateList?.filter((template) =>
            getCampaignName
              ?.toLowerCase()
              ?.includes(template?.campaign_name?.toLowerCase())
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
          if (newCampaignData?.name === "") {
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
      if (currentTier?.includes("Add-ons")) {
        const charged_name = currentTier?.split(" + ");
        const tierName = charged_name[0]; // Extract "Tier Name"

        setMyPlan(tierName);
      } else {
        setMyPlan(currentTier);
      }
    }

    if (totalCampaigns) {
      setTotalCampaign(totalCampaigns);
    }
  }, [currentTier, totalCampaigns]);

  useEffect(() => {
    if (campaignName) {
      let filteredArray = [];
      let filteredCampaignName = campaignName?.filter((camp) => {
        if (camp != draftCampaignName) {
          filteredArray.push(camp);
        }
      });

      setExcludeEditCampaignName([...filteredArray]);
    }
  }, [campaignName, isEdit, editCampaignData]);

  // Get Klaviyo integration Lists from API
  async function getKlaviyoList() {
    try {
      if (
        globalSettings?.klaviyo_api_key !== "" ||
        newCampaignData?.klaviyo_api_key !== ""
      ) {
        const response = await fetch(`/api/lists`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: abortController.signal,
        });

        if (response.ok) {
          const list = await response.json();
          return list;
        } else {
          return;
        }
      }
    } catch (err) {
      return err;
    }
  }

  // Update Klaviyo API Lists in the Form
  useEffect(() => {
    if (isEdit && editCampaignData?.klaviyo_api_key != "") {
      async function getLists() {
        const response = await fetch(`/api/lists`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const list = await response.json();
          setKlaviyoList([...list]);
        } else {
          return;
        }
      }

      getLists();
    } else if (!isEdit && globalSettings?.klaviyo_api_key != null) {
      async function getLists() {
        const response = await fetch(`/api/lists`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const list = await response.json();
          setKlaviyoList([...list]);
        } else {
          return;
        }
      }

      getLists();
    }
  }, [globalSettings?.klaviyo_api_key, editCampaignData?.klaviyo_api_key]);

  //? When user try to reload or change the route to other page
  useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";

      return "";
    };

    window.addEventListener("beforeunload", unloadCallback);
    return () => {
      window.removeEventListener("beforeunload", unloadCallback);
    };
  }, []);

  // Update Produts selected list when user select the Launch Product ID
  useEffect(() => {
    if (getProducts?.productsList) {
      if (isEdit) {
        let lists = getProducts?.productsList?.filter(
          (product) => product?.title !== editCampaignData?.product
        );
        setProducts((prevList) => ({
          ...prevList,
          filteredTierProducts: [...lists],
        }));
      } else {
        let lists = getProducts?.productsList?.filter(
          (product) => product?.title !== newCampaignData?.product
        );
        setProducts((prevList) => ({
          ...prevList,
          filteredTierProducts: [...lists],
        }));
      }
    }
  }, [newCampaignData?.product || editCampaignData?.product]);

  // Update Campaign data changes when the selectProducts and new Campaign data changes
  useEffect(() => {
    if (isEdit) {
      setUpdateCampaignData((prevChanges) => ({
        ...prevChanges,
        ...selectProducts,
        ...editCampaignData,
      }));
    } else {
      setUpdateCampaignData((prevChanges) => ({
        ...prevChanges,
        ...selectProducts,
        ...newCampaignData,
      }));
    }
  }, [newCampaignData, editCampaignData]);

  useEffect(() => {
    // We are getting Ids and title of Products from Product List API
    const newArray =
      products.map((prod) => ({ id: prod.id, name: prod.title })) || [];

    // Pass the name of product to Get ID of that product
    const FindProductID = (productName) =>
      newArray.find((prod) => (prod.name === productName ? prod.id : null));

    if (editCampaignData?.is_draft) {
      let productID, tier1_id, tier2_id, tier3_id, tier4_id;
      if (editCampaignData?.product != "") {
        productID = FindProductID(editCampaignData?.product);
      }
      if (editCampaignData?.reward_1_product != "") {
        tier1_id = FindProductID(editCampaignData?.reward_1_product);
      }
      if (editCampaignData?.reward_2_product != "") {
        tier2_id = FindProductID(editCampaignData?.reward_2_product);
      }
      if (editCampaignData?.reward_3_product != "") {
        tier3_id = FindProductID(editCampaignData?.reward_3_product);
      }
      if (editCampaignData?.reward_4_product != "") {
        tier4_id = FindProductID(editCampaignData?.reward_4_product);
      }
      setSelectProducts((prev) => ({
        ...prev,
        launchProductId: productID?.id || null,
        launchProductTitle: editCampaignData?.product || "",
        tier1ProductName: editCampaignData?.reward_1_product || "",
        tier1ProductId: tier1_id?.id || null,
        tier2ProductName: editCampaignData?.reward_2_product || "",
        tier2ProductId: tier2_id?.id || null,
        tier3ProductName: editCampaignData?.reward_3_product || "",
        tier3ProductId: tier3_id?.id || null,
        tier4ProductName: editCampaignData?.reward_4_product || "",
        tier4ProductId: tier4_id?.id || null,
      }));
    }
  }, [editCampaignData, getProducts]); // selectProducts

  //? Event handling functions

  const ExampleCustomInput = forwardRef(({ value, onClick, onChange }, ref) => (
    <div className="wrapper">
      <div className="icon">
        <AiOutlineCalendar
          style={{ height: "20px", width: "20px" }}
          onClick={onClick}
        />
      </div>
      <input
        value={value}
        className="example-custom-input"
        onChange={onChange}
        ref={ref}
      ></input>
    </div>
  ));

  // Display Next Button on each form
  const renderButton = (id) => {
    return (
      <button className="nextBtn" onClick={() => handleNext(id)}>
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
    setNewCampaignData((prev) => ({ ...prev, template_id: null }));
    setSelectedTemplateData(undefined);

    setExpanded((prevExpand) =>
      prevExpand.map((state, i) => (i === index ? !state : false))
    );
  };
  // Handle Next Button event for each sub-form section
  const handleNext = (index) => {
    // Edit Campaign Form
    if (isEdit) {
      // If Campaign is not Draft
      if (!editCampaignData?.is_draft) {
        const isValid = validateForm();
        if (index === 1 && isValid === false) {
          SetFormErrors((prevErrors) => ({
            ...prevErrors,
            requiredInputName: true,
          }));
          setExpanded((prevExpand) =>
            prevExpand.map((state, i) => i === index - 1 && true)
          );
        } else {
          SetFormErrors((prevErrors) => ({
            ...prevErrors,
            campaignNameError: false,
          }));
          setExpanded((prevExpand) =>
            prevExpand.map((state, i) => (i === index ? !state : false))
          );
        }
      } else {
        // When Editing a Draft Campaign
        const isValid = validateForm();
        if (index === 1 && isValid === false) {
          SetFormErrors((prevErrors) => ({
            ...prevErrors,
            requiredInputName: true,
          }));
          setExpanded((prevExpand) =>
            prevExpand.map((state, i) => i === index - 1 && true)
          );
        } else if (index === 1 && editCampaignData?.name !== "") {
          if (excludeEditCampaignName?.includes(editCampaignData?.name)) {
            SetFormErrors((prevErrors) => ({
              ...prevErrors,
              campaignNameError: true,
            }));
            setExpanded((prevExpand) =>
              prevExpand.map((state, i) => i === index - 1 && true)
            );
          } else {
            if (
              editCampaignData?.discount_type == "product" &&
              editCampaignData?.product != ""
            ) {
              SetFormErrors((prevState) => ({
                ...prevState,
                LaunchProductError: false,
              }));
            } else if (
              editCampaignData?.discount_type == "product" &&
              editCampaignData?.product == ""
            ) {
              SetFormErrors((prevState) => ({
                ...prevState,
                LaunchProductError: true,
              }));
            } else {
              SetFormErrors((prevState) => ({
                ...prevState,
                LaunchProductError: false,
              }));
            }
            // setErrorMessage(false);
            SetFormErrors((prevErrors) => ({
              ...prevErrors,
              requiredInputName: false,
              campaignNameError: false,
            }));
            setUpdateCampaignData((prev) => ({
              ...prev,
              ...selectProducts,
              ...editCampaignData,
            }));
            setExpanded((prevExpand) =>
              prevExpand.map((state, i) => (i === index ? !state : false))
            );
          }
        } else {
          SetFormErrors((prevErrors) => ({
            ...prevErrors,
            campaignNameError: false,
          }));
          setExpanded((prevExpand) =>
            prevExpand.map((state, i) => (i === index ? !state : false))
          );
        }
      }
    }
    // New campaign form
    else {
      const isValid = validateForm();
      if (index === 1 && isValid === false) {
        // setErrorMessage(true);

        setExpanded((prevExpand) =>
          prevExpand.map((state, i) => i === index - 1 && true)
        );
        SetFormErrors((prevErrors) => ({
          ...prevErrors,
          requiredInputName: true,
        }));
      } else if (index === 1 && newCampaignData?.name !== "") {
        if (campaignName?.includes(newCampaignData?.name)) {
          SetFormErrors((prevErrors) => ({
            ...prevErrors,
            campaignNameError: true,
          }));
          setExpanded((prevExpand) =>
            prevExpand.map((state, i) => i === index - 1 && true)
          );
        } else {
          if (
            newCampaignData?.discount_type == "product" &&
            newCampaignData?.product != ""
          ) {
            SetFormErrors((prevState) => ({
              ...prevState,
              LaunchProductError: false,
            }));
          } else if (
            newCampaignData?.discount_type == "product" &&
            newCampaignData?.product == ""
          ) {
            SetFormErrors((prevState) => ({
              ...prevState,
              LaunchProductError: true,
            }));
          } else {
            SetFormErrors((prevState) => ({
              ...prevState,
              LaunchProductError: false,
            }));
          }
          // setErrorMessage(false);
          SetFormErrors((prevErrors) => ({
            ...prevErrors,
            requiredInputName: false,
            campaignNameError: false,
          }));
          setUpdateCampaignData((prev) => ({
            ...prev,
            ...selectProducts,
            ...newCampaignData,
          }));
          // setErrorName(false);
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
  };

  // Check if all fields in a tier are filled
  const isTierFilled = (tier) => {
    if (isEdit) {
      return (
        editCampaignData[`reward_${tier}_tier`] &&
        editCampaignData[`reward_${tier}_discount`] &&
        editCampaignData[`reward_${tier}_code`]
      );
    } else {
      return (
        newCampaignData[`reward_${tier}_tier`] &&
        newCampaignData[`reward_${tier}_discount`] &&
        newCampaignData[`reward_${tier}_code`]
      );
    }
  };

  // When Discount code is "Product" selected
  const isFreeProductTierFilled = (tier) => {
    if (isEdit) {
      return (
        editCampaignData[`reward_${tier}_tier`] &&
        editCampaignData[`reward_${tier}_product`] &&
        editCampaignData[`reward_${tier}_code`]
      );
    } else {
      return (
        newCampaignData[`reward_${tier}_tier`] &&
        newCampaignData[`reward_${tier}_product`] &&
        newCampaignData[`reward_${tier}_code`]
      );
    }
  };

  // Enable or disable fields based on whether the previous tier is filled
  const isFieldDisabled = (tier) => {
    return tier > 1 && !isTierFilled(tier - 1);
  };

  const isProductFieldDisabled = (tier) => {
    return tier > 1 && !isFreeProductTierFilled(tier - 1);
  };
  // Reward Settings Validation for New Campaign   ------- Check if all fields are filled
  const isReward1Filled = isEdit
    ? !!editCampaignData[`reward_1_tier`] &&
      !!editCampaignData[`reward_1_discount`] &&
      !!editCampaignData[`reward_1_code`]
    : !!newCampaignData[`reward_1_tier`] &&
      !!newCampaignData[`reward_1_discount`] &&
      !!newCampaignData[`reward_1_code`];
  const isReward2Filled = isEdit
    ? !!editCampaignData[`reward_2_tier`] &&
      !!editCampaignData[`reward_2_discount`] &&
      !!editCampaignData[`reward_2_code`]
    : !!newCampaignData[`reward_2_tier`] &&
      !!newCampaignData[`reward_2_discount`] &&
      !!newCampaignData[`reward_2_code`];
  const isReward3Filled = isEdit
    ? !!editCampaignData[`reward_3_tier`] &&
      !!editCampaignData[`reward_3_discount`] &&
      !!editCampaignData[`reward_3_code`]
    : !!newCampaignData[`reward_3_tier`] &&
      !!newCampaignData[`reward_3_discount`] &&
      !!newCampaignData[`reward_3_code`];
  const isReward4Filled = isEdit
    ? !!editCampaignData[`reward_4_tier`] &&
      !!editCampaignData[`reward_4_discount`] &&
      !!editCampaignData[`reward_4_code`]
    : !!newCampaignData[`reward_4_tier`] &&
      !!newCampaignData[`reward_4_discount`] &&
      !!newCampaignData[`reward_4_code`];

  // When Discount_type is Free Product selected

  const isReward1ProductFilled = isEdit
    ? !!editCampaignData[`reward_1_tier`] &&
      !!editCampaignData[`reward_1_product`] &&
      !!editCampaignData[`reward_1_code`]
    : !!newCampaignData[`reward_1_tier`] &&
      !!newCampaignData[`reward_1_product`] &&
      !!newCampaignData[`reward_1_code`];
  const isReward2ProductFilled = isEdit
    ? !!editCampaignData[`reward_2_tier`] &&
      !!editCampaignData[`reward_2_product`] &&
      !!editCampaignData[`reward_2_code`]
    : !!newCampaignData[`reward_2_tier`] &&
      !!newCampaignData[`reward_2_product`] &&
      !!newCampaignData[`reward_2_code`];
  const isReward3ProductFilled = isEdit
    ? !!editCampaignData[`reward_3_tier`] &&
      !!editCampaignData[`reward_3_product`] &&
      !!editCampaignData[`reward_3_code`]
    : !!newCampaignData[`reward_3_tier`] &&
      !!newCampaignData[`reward_3_product`] &&
      !!newCampaignData[`reward_3_code`];
  const isReward4ProductFilled = isEdit
    ? !!editCampaignData[`reward_4_tier`] &&
      !!editCampaignData[`reward_4_product`] &&
      !!editCampaignData[`reward_4_code`]
    : !!newCampaignData[`reward_4_tier`] &&
      !!newCampaignData[`reward_4_product`] &&
      !!newCampaignData[`reward_4_code`];

  // Validation of  Required fields of the Form
  const validateForm = () => {
    const requiredFields = document.querySelectorAll(
      "input[required], select[required]"
    );
    let isFormValid = true;
    requiredFields.forEach((field) => {
      if (!field.value) {
        isFormValid = false;
        // setErrorMessage(true);
        SetFormErrors((prevErrors) => ({
          ...prevErrors,
          requiredInputName: true,
        }));
      } else {
        SetFormErrors((prevErrors) => ({
          ...prevErrors,
          requiredInputName: false,
        }));
      }
    });
    return isFormValid;
  };

  // Get Product Id
  function findProductId(productName) {
    // Find the Product ID of user Selected Product Title
    const { id: productId } =
      getProducts?.productsList?.find(
        (product) => product?.title === productName
      ) || {};

    return productId || null;
  }


  // Handle Discount Codes Validation on Next Button click
  const handleDiscountValidation = (index) => {
    if (!isEdit) {
      // Validate Discount values and Discount codes in New campaign data onChange event
      const ValidateDiscountValue = isValidDiscount();
      setIsReward2Error(ValidateDiscountValue?.Reward1Error);
      setIsReward3Error(ValidateDiscountValue?.Reward2Error);
      setIsReward4Error(ValidateDiscountValue?.Reward3Error);

      const validateDiscountCodes = isValidDiscountCode();
      setDiscountCode1(validateDiscountCodes?.Reward1CodeError);
      setDiscountCode2(validateDiscountCodes?.Reward2CodeError);
      setDiscountCode3(validateDiscountCodes?.Reward3CodeError);
      setDiscountCode4(validateDiscountCodes?.Reward4CodeError);

      // Check if any error is true in isValidDiscount or isValidDiscountCode
      if (
        ValidateDiscountValue.Reward1Error ||
        ValidateDiscountValue.Reward2Error ||
        ValidateDiscountValue.Reward3Error ||
        validateDiscountCodes.Reward1CodeError ||
        validateDiscountCodes.Reward2CodeError ||
        validateDiscountCodes.Reward3CodeError ||
        validateDiscountCodes.Reward4CodeError
      ) {
        // Display error messages and keep the form open
        setExpanded((prevExpand) =>
          prevExpand.map((state, i) => i === index - 1 && true)
        );
        return;
      }

      const duplicateTiers = []; // Array to store tier IDs with duplicate discount codes
      const userDiscountCodes = RewardData?.map((reward) => {
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

      if (
        newCampaignData?.discount_type == "product" &&
        formErrors?.LaunchProductError
      ) {
        setExpanded((prevExpand) =>
          prevExpand.map((state, i) => i === index - 1 && true)
        );
      }

      // if (newCampaignData?.discount_type != "product") {
      if (
        (isReward1Filled && isReward2Filled) ||
        (isReward1ProductFilled && isReward2ProductFilled)
      ) {
        if (newCampaignData?.discount_type == "product") {
          if (formErrors?.LaunchProductError) {
            setExpanded((prevExpand) =>
              prevExpand.map((state, i) => i === index - 1 && true)
            );
          }
        }

        setRewardTierValidate(false);

        // Step 3: Handle duplicate discount codes
        if (duplicateTiers?.length > 0) {
          // Display error message on the corresponding tiers' cards

          if (duplicateTiers?.includes(1)) {
            setDiscountCode1(true);
            setExpanded((prevExpand) =>
              prevExpand.map((state, i) => i === index - 1 && true)
            );
          }
          if (duplicateTiers?.includes(2)) {
            setDiscountCode2(true);
            setExpanded((prevExpand) =>
              prevExpand.map((state, i) => i === index - 1 && true)
            );
          }
          if (duplicateTiers?.includes(3)) {
            setDiscountCode3(true);
            setExpanded((prevExpand) =>
              prevExpand.map((state, i) => i === index - 1 && true)
            );
          }
          if (duplicateTiers?.includes(4)) {
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
          clearDiscountCodes(); // Clear discount code errors

          // Open Next Form .... and Proceed
          setExpanded((prevExpand) =>
            prevExpand.map((state, i) => (i === index ? !state : false))
          );
        }
      } else {
        setRewardTierValidate(true);
        setExpanded((prevExpand) =>
          prevExpand.map((state, i) => i === index - 1 && true)
        );
      }
      // }

      setUpdateCampaignData((prev) => ({
        ...prev,
        ...selectProducts,
        ...newCampaignData,
      }));
    } else {
      // When is Edit is True but Campaign is not Draft campaign
      if (!editCampaignData?.is_draft) {
        setExpanded((prevExpand) =>
          prevExpand.map((state, i) => (i === index ? !state : false))
        );
      } else {
        // When Editing a Draft Campaign Form Settings
        // Validate Discount values and Discount codes in New campaign data onChange event
        const ValidateDiscountValue = isValidDiscount();
        setIsReward2Error(ValidateDiscountValue?.Reward1Error);
        setIsReward3Error(ValidateDiscountValue?.Reward2Error);
        setIsReward4Error(ValidateDiscountValue?.Reward3Error);

        const validateDiscountCodes = isValidDiscountCode();
        setDiscountCode1(validateDiscountCodes?.Reward1CodeError);
        setDiscountCode2(validateDiscountCodes?.Reward2CodeError);
        setDiscountCode3(validateDiscountCodes?.Reward3CodeError);
        setDiscountCode4(validateDiscountCodes?.Reward4CodeError);

        // Check if any error is true in isValidDiscount or isValidDiscountCode
        if (
          ValidateDiscountValue.Reward1Error ||
          ValidateDiscountValue.Reward2Error ||
          ValidateDiscountValue.Reward3Error ||
          validateDiscountCodes.Reward1CodeError ||
          validateDiscountCodes.Reward2CodeError ||
          validateDiscountCodes.Reward3CodeError ||
          validateDiscountCodes.Reward4CodeError
        ) {
          // Display error messages and keep the form open
          setExpanded((prevExpand) =>
            prevExpand.map((state, i) => i === index - 1 && true)
          );
          return;
        }

        const duplicateTiers = []; // Array to store tier IDs with duplicate discount codes
        const userDiscountCodes = RewardData?.map((reward) => {
          const rewardId = reward.id;
          const inputName = `reward_${rewardId}_code`;
          return editCampaignData[inputName];
        });

        // Check Duplicates Discount codes and push the Tiers IDs in duplicateTiers array
        userDiscountCodes?.forEach((code, index) => {
          if (discountList?.includes(code)) {
            duplicateTiers.push(index + 1); // Push the tier ID (index + 1) to the array
          }
        });

        if (
          editCampaignData?.discount_type == "product" &&
          formErrors?.LaunchProductError
        ) {
          setExpanded((prevExpand) =>
            prevExpand.map((state, i) => i === index - 1 && true)
          );
        }

        if (
          (isReward1Filled && isReward2Filled) ||
          (isReward1ProductFilled && isReward2ProductFilled)
        ) {
          if (editCampaignData?.discount_type == "product") {
            if (formErrors?.LaunchProductError) {
              setExpanded((prevExpand) =>
                prevExpand.map((state, i) => i === index - 1 && true)
              );
            }
          }

          setRewardTierValidate(false);

          // Step 3: Handle duplicate discount codes
          if (duplicateTiers?.length > 0) {
            // Display error message on the corresponding tiers' cards

            if (duplicateTiers?.includes(1)) {
              setDiscountCode1(true);
              setExpanded((prevExpand) =>
                prevExpand.map((state, i) => i === index - 1 && true)
              );
            }
            if (duplicateTiers?.includes(2)) {
              setDiscountCode2(true);
              setExpanded((prevExpand) =>
                prevExpand.map((state, i) => i === index - 1 && true)
              );
            }
            if (duplicateTiers?.includes(3)) {
              setDiscountCode3(true);
              setExpanded((prevExpand) =>
                prevExpand.map((state, i) => i === index - 1 && true)
              );
            }
            if (duplicateTiers?.includes(4)) {
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
            clearDiscountCodes(); // Clear discount code errors

            // Open Next Form .... and Proceed
            setExpanded((prevExpand) =>
              prevExpand.map((state, i) => (i === index ? !state : false))
            );
          }
        } else {
          setRewardTierValidate(true);
          setExpanded((prevExpand) =>
            prevExpand.map((state, i) => i === index - 1 && true)
          );
        }
        setUpdateCampaignData((prev) => ({
          ...prev,
          ...selectProducts,
          ...editCampaignData,
        }));
      }
    }
  };

  //  function to clear discount code errors
  const clearDiscountCodes = () => {
    setDiscountCode1(false);
    setDiscountCode2(false);
    setDiscountCode3(false);
    setDiscountCode4(false);
  };
  //? Validate if discount codes are unique in Each Reward tiers discount code input field
  const isValidDiscountCode = () => {
    const reward1Code = isEdit
      ? editCampaignData["reward_1_code"]
      : newCampaignData["reward_1_code"];
    const reward2Code = isEdit
      ? editCampaignData["reward_2_code"]
      : newCampaignData["reward_2_code"];
    const reward3Code = isEdit
      ? editCampaignData["reward_3_code"]
      : newCampaignData["reward_3_code"];
    const reward4Code = isEdit
      ? editCampaignData["reward_4_code"]
      : newCampaignData["reward_4_code"];

    let Reward1CodeError = false;
    let Reward2CodeError = false;
    let Reward3CodeError = false;
    let Reward4CodeError = false;

    if (isEdit) {
      if (editCampaignData?.discount_type != "product") {
        if (isReward1Filled && isReward2Filled) {
          if (reward1Code === reward2Code) {
            Reward2CodeError = true;
          }
        }
        if (isReward3Filled && isReward4Filled) {
          if (reward3Code === reward4Code) {
            Reward4CodeError = true;
          }
        }

        if (isReward2Filled && isReward3Filled) {
          if (reward2Code === reward3Code) {
            Reward3CodeError = true;
          }
        }
        if (isReward1Filled && isReward4Filled) {
          if (reward1Code === reward4Code) {
            Reward4CodeError = true;
          }
        }

        return {
          Reward1CodeError,
          Reward2CodeError,
          Reward3CodeError,
          Reward4CodeError,
        };
      } else {
        if (isReward1ProductFilled && isReward2ProductFilled) {
          if (reward1Code === reward2Code) {
            Reward2CodeError = true;
          }
        }
        if (isReward3ProductFilled && isReward4ProductFilled) {
          if (reward3Code === reward4Code) {
            Reward4CodeError = true;
          }
        }

        if (isReward2ProductFilled && isReward3ProductFilled) {
          if (reward2Code === reward3Code) {
            Reward3CodeError = true;
          }
        }
        if (isReward1ProductFilled && isReward4ProductFilled) {
          if (reward1Code === reward4Code) {
            Reward4CodeError = true;
          }
        }

        return {
          Reward1CodeError,
          Reward2CodeError,
          Reward3CodeError,
          Reward4CodeError,
        };
      }
    } else {
      if (newCampaignData?.discount_type != "product") {
        if (isReward1Filled && isReward2Filled) {
          if (reward1Code === reward2Code) {
            Reward2CodeError = true;
          }
        }
        if (isReward3Filled && isReward4Filled) {
          if (reward3Code === reward4Code) {
            Reward4CodeError = true;
          }
        }

        if (isReward2Filled && isReward3Filled) {
          if (reward2Code === reward3Code) {
            Reward3CodeError = true;
          }
        }
        if (isReward1Filled && isReward4Filled) {
          if (reward1Code === reward4Code) {
            Reward4CodeError = true;
          }
        }

        return {
          Reward1CodeError,
          Reward2CodeError,
          Reward3CodeError,
          Reward4CodeError,
        };
      } else {
        if (isReward1ProductFilled && isReward2ProductFilled) {
          if (reward1Code === reward2Code) {
            Reward2CodeError = true;
          }
        }
        if (isReward3ProductFilled && isReward4ProductFilled) {
          if (reward3Code === reward4Code) {
            Reward4CodeError = true;
          }
        }

        if (isReward2ProductFilled && isReward3ProductFilled) {
          if (reward2Code === reward3Code) {
            Reward3CodeError = true;
          }
        }
        if (isReward1ProductFilled && isReward4ProductFilled) {
          if (reward1Code === reward4Code) {
            Reward4CodeError = true;
          }
        }

        return {
          Reward1CodeError,
          Reward2CodeError,
          Reward3CodeError,
          Reward4CodeError,
        };
      }
    }
  };

  //? Validate if rewards tiers are not having same Discount Value in Each Tiers
  const isValidDiscount = () => {
    const reward1Discount = isEdit
      ? parseFloat(editCampaignData["reward_1_discount"])
      : parseFloat(newCampaignData["reward_1_discount"]);
    const reward2Discount = isEdit
      ? parseFloat(editCampaignData["reward_2_discount"])
      : parseFloat(newCampaignData["reward_2_discount"]);
    const reward3Discount = isEdit
      ? parseFloat(editCampaignData["reward_3_discount"])
      : parseFloat(newCampaignData["reward_3_discount"]);
    const reward4Discount = isEdit
      ? parseFloat(editCampaignData["reward_4_discount"])
      : parseFloat(newCampaignData["reward_4_discount"]);

    let Reward1Error = false;
    let Reward2Error = false;
    let Reward3Error = false;
    if (isEdit) {
      if (editCampaignData?.is_draft) {
        // When Discount type is Amount/Percent
        if (editCampaignData?.discount_type != "product") {
          if (reward1Discount >= reward2Discount) {
            Reward1Error = true;
          }
          if (reward2Discount >= reward3Discount) {
            Reward2Error = true;
          }
          if (reward3Discount >= reward4Discount) {
            Reward3Error = true;
          }

          return {
            Reward1Error,
            Reward2Error,
            Reward3Error,
          };
        } else {
          // No need to Validate Discount Values when discount type Product is Selected
          return {
            Reward1Error,
            Reward2Error,
            Reward3Error,
          };
        }
      } else {
        return {
          Reward1Error,
          Reward2Error,
          Reward3Error,
        };
      }
    } else {
      if (newCampaignData?.discount_type != "product") {
        if (reward1Discount >= reward2Discount) {
          Reward1Error = true;
        }
        if (reward2Discount >= reward3Discount) {
          Reward2Error = true;
        }
        if (reward3Discount >= reward4Discount) {
          Reward3Error = true;
        }

        return {
          Reward1Error,
          Reward2Error,
          Reward3Error,
        };
      } else {
        return {
          Reward1Error,
          Reward2Error,
          Reward3Error,
        };
      }
    }
  };

  const handleProductChange = (value, tierId) => {
    if (value === "") {
      // Handle product empty case
      handleEmptyProduct();
    } else {
      // Handle product selected case
      handleSelectedProduct(value, tierId);
    }
  };

  const handleEmptyProduct = () => {
    setSelectProducts((prevState) => ({
      ...prevState,
      launchProductTitle: "",
      launchProductId: null,
    }));
    SetFormErrors((prevState) => ({
      ...prevState,
      LaunchProductError: true,
    }));
    if (isEdit && editCampaignData?.is_draft) {
      setEditCampaignData((prevCamp) => ({ ...prevCamp, product: "" }));
      setUpdateCampaignData((prevChanges) => ({
        ...prevChanges,
        ...selectProducts,
        ...editCampaignData,
      }));
    } else {
      setNewCampaignData((prevCamp) => ({ ...prevCamp, product: "" }));
      setUpdateCampaignData((prevChanges) => ({
        ...prevChanges,
        ...selectProducts,
        ...newCampaignData,
      }));
    }
  };

  const handleSelectedProduct = (value, tierId) => {
    const productId = findProductId(value);

    setSelectProducts((prevState) => ({
      ...prevState,
      launchProductTitle: value,
      launchProductId: productId,
    }));

    SetFormErrors((formError) => ({
      ...formError,
      LaunchProductError: false,
    }));

    if (isEdit && editCampaignData?.is_draft) {
      setEditCampaignData((prevCamp) => ({ ...prevCamp, product: value }));

      setUpdateCampaignData((prevChanges) => ({
        ...prevChanges,
        ...selectProducts,
        ...editCampaignData,
      }));
    } else {
      setNewCampaignData((prevCamp) => ({ ...prevCamp, product: value }));

      setUpdateCampaignData((prevChanges) => ({
        ...prevChanges,
        ...selectProducts,
        ...newCampaignData,
      }));
    }
  };

  // Update the Reward Product
  const handleRewardProductChange = (name, value, tierId) => {
    if (isEdit) {
      // Editing Draft Campaign
      if (editCampaignData?.is_draft) {
        if (value !== "") {
          let getProductId = findProductId(value);
          setEditCampaignData((prevCam) => ({ ...prevCam, [name]: value }));

          setUpdateCampaignData((prevChanges) => ({
            ...prevChanges,
            ...selectProducts,
            ...editCampaignData,
          }));

          setSelectProducts((prevState) => ({
            ...prevState,
            [`tier${tierId}ProductName`]: value,
            [`tier${tierId}ProductId`]: getProductId,
          }));
        } else {
          setUpdateCampaignData((prevChanges) => ({
            ...prevChanges,
            ...selectProducts,
            ...editCampaignData,
          }));
        }
      } else {
        setUpdateCampaignData((prevChanges) => ({
          ...prevChanges,
          ...selectProducts,
          ...editCampaignData,
        }));
      }
    } else {
      if (value !== "") {
        let getProductId = findProductId(value);

        setUpdateCampaignData((prevChanges) => ({
          ...prevChanges,
          ...selectProducts,
          ...newCampaignData,
        }));

        setSelectProducts((prevState) => ({
          ...prevState,
          [`tier${tierId}ProductName`]: value,
          [`tier${tierId}ProductId`]: getProductId,
        }));
      } else {
        setUpdateCampaignData((prevChanges) => ({
          ...prevChanges,
          ...selectProducts,
          ...newCampaignData,
        }));
      }
    }
  };
  // Handle Input Chane event in new Campaign and Update Campaign Form

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (isEdit) {
      if (editCampaignData?.is_draft) {
        setEditCampaignData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
        const tierId = name?.split("_")[1];

        if (name === "name" && value != "") {
          SetFormErrors((prevErrors) => ({
            ...prevErrors,
            requiredInputName: false,
          }));
        }
        if (name === "product" && value == "") {
          handleEmptyProduct(value, tierId);
        }

        if (name === "product" && value != "") {
          handleSelectedProduct(value, tierId);
          SetFormErrors((prevErrors) => ({
            ...prevErrors,
            LaunchProductError: false,
          }));
        }

        if (
          selectProducts?.launchProductTitle == "" ||
          editCampaignData?.product == ""
        ) {
          SetFormErrors((formError) => ({
            ...formError,
            LaunchProductError: false,
          }));
        }

        if (name === `reward_${tierId}_product`) {
          handleRewardProductChange(name, value, tierId);
        }

        // Validate Discount values and Discount codes in New campaign data onChange event

        let ValidateDiscountValue = isValidDiscount();
        setIsReward2Error(ValidateDiscountValue?.Reward1Error);
        setIsReward3Error(ValidateDiscountValue?.Reward2Error);
        setIsReward4Error(ValidateDiscountValue?.Reward3Error);

        let validateDicountCodes = isValidDiscountCode();
        setDiscountCode1(validateDicountCodes?.Reward1CodeError);
        setDiscountCode2(validateDicountCodes?.Reward2CodeError);
        setDiscountCode3(validateDicountCodes?.Reward3CodeError);
        setDiscountCode4(validateDicountCodes?.Reward4CodeError);

        if (editCampaignData?.discount_type != "product") {
          SetFormErrors((prevErrors) => ({
            ...prevErrors,
            LaunchProductError: false,
          }));
        } else {
          if (editCampaignData.product !== "") {
            SetFormErrors((prevErrors) => ({
              ...prevErrors,
              LaunchProductError: false,
            }));
          } else {
            SetFormErrors((prevErrors) => ({
              ...prevErrors,
              LaunchProductError: true,
            }));
          }
          setUpdateCampaignData((prev) => ({
            ...prev,
            ...selectProducts,
            ...editCampaignData,
          }));
        }
        // value is asynchronic, so it's updated in the next render
        if (e.target.value !== "" && !isLoading) setDraftModal(true);
        else setDraftModal(false);
      } else {
        // if campaign is not draft, Update Changes to Edit Campaign Form
        setEditCampaignData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    } else {
      setUpdateCampaignData((prev) => ({
        ...prev,
        ...selectProducts,
        ...newCampaignData,
      }));

      setNewCampaignData((prevState) => ({
        ...prevState,
        [name]: value,
      }));

      const tierId = name?.split("_")[1];

      if (name === "product" && value == "") {
        handleEmptyProduct(value, tierId);
      }

      if (name === "product" && value != "") {
        handleSelectedProduct(value, tierId);
        SetFormErrors((prevErrors) => ({
          ...prevErrors,
          LaunchProductError: false,
        }));
      }

      if (
        selectProducts?.launchProductTitle == "" ||
        newCampaignData?.product == ""
      ) {
        SetFormErrors((formError) => ({
          ...formError,
          LaunchProductError: false,
        }));
      }

      if (name === `reward_${tierId}_product`) {
        handleRewardProductChange(name, value, tierId);
      }

      // Validate Discount values and Discount codes in New campaign data onChange event

      let ValidateDiscountValue = isValidDiscount();
      setIsReward2Error(ValidateDiscountValue?.Reward1Error);
      setIsReward3Error(ValidateDiscountValue?.Reward2Error);
      setIsReward4Error(ValidateDiscountValue?.Reward3Error);

      let validateDicountCodes = isValidDiscountCode();
      setDiscountCode1(validateDicountCodes?.Reward1CodeError);
      setDiscountCode2(validateDicountCodes?.Reward2CodeError);
      setDiscountCode3(validateDicountCodes?.Reward3CodeError);
      setDiscountCode4(validateDicountCodes?.Reward4CodeError);

      if (newCampaignData?.discount_type != "product") {
        SetFormErrors((prevErrors) => ({
          ...prevErrors,
          LaunchProductError: false,
        }));
      } else {
        if (newCampaignData.product !== "") {
          SetFormErrors((prevErrors) => ({
            ...prevErrors,
            LaunchProductError: false,
          }));
        } else {
          SetFormErrors((prevErrors) => ({
            ...prevErrors,
            LaunchProductError: true,
          }));
        }
        setUpdateCampaignData((prev) => ({
          ...prev,
          ...selectProducts,
          ...newCampaignData,
        }));
      }

      // value is asynchronic, so it's updated in the next render
      if (e.target.value !== "" && !isLoading) setDraftModal(true);
      else setDraftModal(false);

      if (newCampaignData?.name !== "") {
        setCampaignName(newCampaignData?.name);
      }
      setUpdateCampaignData((prev) => ({
        ...prev,
        ...selectProducts,
        ...newCampaignData,
      }));
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
      if (editCampaignData?.is_draft) {
        setEditCampaignData((prevcampaignData) => ({
          ...prevcampaignData,
          discount_type: value,
        }));
        if (value === "product") {
          setEditCampaignData((prevCamp) => ({
            ...prevCamp,
            reward_email: selectProducts?.reward_email_template,
            reward_1_discount: 0,
            reward_2_discount: 0,
          }));
          if (
            editCampaignData?.product == "" ||
            selectProducts?.launchProductTitle == ""
          ) {
            SetFormErrors((prevErrors) => ({
              ...prevErrors,
              LaunchProductError: true,
            }));
          } else {
            SetFormErrors((prevErrors) => ({
              ...prevErrors,
              LaunchProductError: false,
            }));
          }
        } else {
          setEditCampaignData((prevCamp) => ({
            ...prevCamp,
            reward_email: editCampaignData?.reward_email,
            reward_1_discount: editCampaignData?.reward_1_discount,
            reward_2_discount: editCampaignData?.reward_2_discount,
          }));
          SetFormErrors((prevErrors) => ({
            ...prevErrors,
            LaunchProductError: false,
          }));
        }
      } else {
        setEditCampaignData((prevcampaignData) => ({
          ...prevcampaignData,
          discount_type: value,
        }));
      }
    }
    // Saving Discount Type in New Campaign Form
    else {
      setNewCampaignData((prevnewcampaignData) => ({
        ...prevnewcampaignData,
        discount_type: value,
      }));

      if (value === "product") {
        setNewCampaignData((prevCamp) => ({
          ...prevCamp,
          reward_email: selectProducts?.reward_email_template,
          reward_1_discount: 0,
          reward_2_discount: 0,
        }));
        if (
          newCampaignData?.product == "" ||
          selectProducts?.launchProductTitle == ""
        ) {
          SetFormErrors((prevErrors) => ({
            ...prevErrors,
            LaunchProductError: true,
          }));
        } else {
          SetFormErrors((prevErrors) => ({
            ...prevErrors,
            LaunchProductError: false,
          }));
        }
      } else {
        setNewCampaignData((prevCamp) => ({
          ...prevCamp,
          reward_email: newCampaignData?.reward_email,
          reward_1_discount: globalSettings?.reward_1_discount,
          reward_2_discount: globalSettings?.reward_2_discount,
        }));
        SetFormErrors((prevErrors) => ({
          ...prevErrors,
          LaunchProductError: false,
        }));
      }
    }
  }

  // Handle Animation running after integrations settings updated

  function NextClick(index) {
    if (isEdit) {
      setExpanded((prevExpand) =>
        prevExpand.map((state, i) => (i === index ? !state : false))
      );
    } else {
      const loadingOverlay = document.getElementById("loading-overlay");
      loadingOverlay.style.display = "block";

      setTimeout(function () {
        loadingOverlay.style.display = "none";
        setExpanded((prevExpand) =>
          prevExpand.map((state, i) => (i === index ? !state : false))
        );
      }, 4000);
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
    toastId.current = toast.loading("Generating discount codes...");
    try {
      const response = await fetch("/api/generate_discount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ campaignData: newCampaignData }),
      });

      if (response?.ok) {
        toast.update(toastId.current, {
          render: "Discount Codes Generated for Campaign",
          type: "success",
          isLoading: true,
          position: "top-right",
          autoClose: 1000,
        });
        const responseData = await response.json();
        setTimeout(() => {
          toast.dismiss(toastId.current);
        }, 1000);
        return responseData;
      } else {
        let error = await response.json();
        toast.update(toastId.current, {
          render: "Failed to Generate Discount Codes for Campaign",
          type: "error",
          isLoading: "false",
          autoClose: 3000,
        });
        setTimeout(() => {
          toast.dismiss(toastId.current);
        }, 3000);
        return error;
      }
    } catch (error) {
      toast.update(toastId.current, {
        render: "Error Generating Discount Codes for Campaign",
        type: "error",
        isLoading: "false",
        autoClose: 5000,
      });
      setTimeout(() => {
        toast.dismiss(toastId.current);
      }, 3000);
      return error;
    }
  }

  // Template Create API Call

  async function createTemplates(selectedTemplateData, newCampaignData) {
    // toastId.current
    const id = toast.loading("Creating Templates for Campaigns...");

    try {
      const response = await fetch("/api/create_template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateData: selectedTemplateData,
          campaignData: newCampaignData,
        }),
      });
      if (response.ok) {
        setTimeout(() => {
          toast.update(id, {
            render: "Template Pages Created for Campaign",
            type: "success",
            isLoading: true,
            position: "top-right",
            autoClose: 3000,
          });
        }, 1000);

        const responseData = await response.json();
        setTimeout(() => {
          toast.dismiss(id);
        }, 2000);
        return responseData?.data;
      } else {
        setTimeout(() => {
          toast.update(id, {
            render: "Failed to Create Template Pages for Campaigns",
            type: "error",
            isLoading: "false",
            autoClose: 2000,
          });
        }, 1000);

        setTimeout(() => {
          toast.dismiss(id);
        }, 3000);
        return "Failed to Create Template Pages for Campaign";
      }
    } catch (error) {
      toast.update(id, {
        render: "Error Creating Template Pages for Campaign",
        type: "error",
        isLoading: "false",
        autoClose: 2000,
      });
      setTimeout(() => {
        toast.dismiss(id);
      }, 3000);
    }
  }

  // Save Campaign Details in database
  const saveCampaignDetails = async (campaign_details) => {
    if (isEdit) {
      let campaignDetailsId = toast.loading("Saving Discount Codes and Pages");
      const detailsResponse = await fetch("/api/campaigndetails", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...campaign_details,
          is_draft: false,
          is_active: true,
        }),
      });

      if (detailsResponse.ok) {
        setTimeout(() => {
          toast.update(campaignDetailsId, {
            render: "Saved discount codes and templates for campaign",
            type: "success",
            isLoading: true,
            position: "top-right",
            autoClose: 3000,
          });
        }, 1000);

        setTimeout(() => {
          toast.dismiss(campaignDetailsId);
        }, 2000);
        const detailsData = await detailsResponse.json();
        return detailsData;
      } else {
        setTimeout(() => {
          toast.update(campaignDetailsId, {
            render:
              "Error Saving Template Pages and Discount Codes for Campaign",
            type: "error",
            isLoading: true,
            position: "top-right",
            autoClose: 3000,
          });
        }, 1000);

        setTimeout(() => {
          toast.dismiss(campaignDetailsId);
        }, 2000);
        console.log("Failed to insert campaign details:", detailsResponse);
      }
    } else {
      // Send POST Request to save Details From database

      let campaignDetailsId = toast.loading("Saving Discount Codes and Pages");
      const detailsResponse = await fetch("/api/campaigndetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...campaign_details,
          is_draft: false,
          is_active: true,
        }),
      });

      if (detailsResponse.ok) {
        setTimeout(() => {
          toast.update(campaignDetailsId, {
            render: "Saved discount codes and templates for campaign",
            type: "success",
            isLoading: true,
            position: "top-right",
            autoClose: 3000,
          });
        }, 1000);

        setTimeout(() => {
          toast.dismiss(campaignDetailsId);
        }, 2000);
        const detailsData = await detailsResponse.json();
        return detailsData;
      } else {
        setTimeout(() => {
          toast.update(campaignDetailsId, {
            render:
              "Error Saving Template Pages and Discount Codes for Campaign",
            type: "error",
            isLoading: true,
            position: "top-right",
            autoClose: 3000,
          });
        }, 1000);

        setTimeout(() => {
          toast.dismiss(campaignDetailsId);
        }, 2000);
        console.log("Failed to insert campaign details:", detailsResponse);
      }
    }
  };

  // Save Campaign Reward Products Details in database
  const saveCampaignProductsDetails = async (product_details, camp_id) => {
    // Send POST Request to save Details From database

    if (isEdit) {
      let campaignDetailsId = toast.loading(
        "Saving Free Rewards Products details.. "
      );
      const detailsResponse = await fetch("/api/campaign-product-details", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...product_details,
          campaign_id: camp_id,
        }),
      });

      if (detailsResponse?.ok) {
        setTimeout(() => {
          toast.update(campaignDetailsId, {
            render: "Saved Free Reward Product details for campaign",
            type: "success",
            isLoading: true,
            position: "top-right",
            autoClose: 3000,
          });
        }, 1000);

        setTimeout(() => {
          toast.dismiss(campaignDetailsId);
        }, 2000);
        const detailsData = await detailsResponse.json();
        return detailsData;
      } else {
        setTimeout(() => {
          toast.update(campaignDetailsId, {
            render: "Error Saving Reward Tiers Products Details for Campaign",
            type: "error",
            isLoading: true,
            position: "top-right",
            autoClose: 3000,
          });
        }, 1000);

        setTimeout(() => {
          toast.dismiss(campaignDetailsId);
        }, 2000);
        console.log(
          "Failed to insert campaign Product details:",
          detailsResponse
        );
      }
    } else {
      let campaignDetailsId = toast.loading(
        "Saving Free Rewards Products details.. "
      );
      const detailsResponse = await fetch("/api/campaign-product-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...product_details,
          campaign_id: camp_id,
        }),
      });

      if (detailsResponse?.ok) {
        setTimeout(() => {
          toast.update(campaignDetailsId, {
            render: "Saved Free Reward Product details for campaign",
            type: "success",
            isLoading: true,
            position: "top-right",
            autoClose: 3000,
          });
        }, 1000);

        setTimeout(() => {
          toast.dismiss(campaignDetailsId);
        }, 2000);
        const detailsData = await detailsResponse.json();
        return detailsData;
      } else {
        setTimeout(() => {
          toast.update(campaignDetailsId, {
            render: "Error Saving Reward Tiers Products Details for Campaign",
            type: "error",
            isLoading: true,
            position: "top-right",
            autoClose: 3000,
          });
        }, 1000);

        setTimeout(() => {
          toast.dismiss(campaignDetailsId);
        }, 2000);
        console.log(
          "Failed to insert campaign Product details:",
          detailsResponse
        );
      }
    }
  };

  // Save  New Campaign form  & Update Campaign Form
  const onSubmit = async (e) => {
    let idExists;
    let campaignDetails;
    // Editing Camapign Data Form
    // Editing Camapign Data Form
    if (isEdit && editCampaignData?.is_draft) {
      e.preventDefault();

      try {
        setDraftModal(false);

        // Update Campaign data of a draft Campaign
        if (expanded[5]) {
          try {
            setIsLoading(true);

            const discount_details = await generateDiscounts({
              ...updateCampaignData,
              ...editCampaignData,
            });
            // Discount Codes Generated

            if (discount_details?.success) {
              // Continue next task
              const template_details = await createTemplates(
                selectedTemplateData,
                updateCampaignData
              );

              campaignDetails = {
                ...discount_details?.data,
                ...template_details,
              };

              let updateCampaignSettingsId = toast.loading(
                "Saving campaign settings..."
              );
              try {
                const updateCampaignSettings = await fetch(
                  `/api/campaignsettings/${campaignsid}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      ...editCampaignData,
                      is_draft: false,
                      is_active: true,
                    }),
                  }
                );

                if (updateCampaignSettings.ok) {
                  setTimeout(() => {
                    toast.update(updateCampaignSettingsId, {
                      render: "Updated Campaign Settings",
                      type: "success",
                      isLoading: true,
                      position: "top-right",
                      autoClose: 5000,
                    });
                  }, 3000);

                  let updatedCamapignData = await updateCampaignSettings.json();
                  idExists =
                    campaignById?.campaign_id || editCampaignData?.campaign_id;
                  // dispatch(updateCampaign(updatedCamapignData));
                } else {
                  setTimeout(() => {
                    toast.update(updateCampaignSettingsId, {
                      render: "Failed to Update Campaign Settings",
                      type: "error",
                      isLoading: "false",
                      autoClose: 2000,
                    });
                  }, 1000);

                  setTimeout(() => {
                    toast.dismiss(updateCampaignSettingsId);
                  }, 3000);
                }
                setIsLoading(false);
                setTimeout(() => {
                  toast.dismiss(updateCampaignSettingsId);
                }, 3000);
                setIsEdit(false);
                navigate("/campaigns");
              } catch (err) {
                console.log(err);
                toast.update(updateCampaignSettingsId, {
                  render: "Error Updating Campaign...",
                  type: "error",
                  isLoading: "false",
                  autoClose: 2000,
                });
                setTimeout(() => {
                  toast.dismiss(updateCampaignSettingsId);
                }, 3000);
              }

              // If Data updated successfully, then save data in
              if (campaignDetails) {
                let result = await saveCampaignDetails(campaignDetails);

                if (result) {
                  dispatch(fetchCampaignDetails(result));
                }
              } else {
                setIsLoading(false);
                handleExpand(2);
                setEditCampaignData((prev) => ({ ...prev, template_id: null }));
                setSelectedTemplateData({});
                setDiscountInvalidError(true);
              }

              // When discount type is Product selected,Saved Product as a Reward Details

              if (editCampaignData?.discount_type == "product") {
                let reward_product_details = await saveCampaignProductsDetails(
                  {
                    ...selectProducts,
                    discount_type: editCampaignData?.discount_type,
                    reward_tier1_referrals: editCampaignData?.reward_1_tier,
                    reward_tier2_referrals: editCampaignData?.reward_2_tier,
                    reward_tier3_referrals: editCampaignData?.reward_3_tier,
                    reward_tier4_referrals: editCampaignData?.reward_4_tier,
                  },
                  idExists
                );
                if (reward_product_details) {
                  console.log("Data Saved Successfully");
                }
              } else {
                setIsLoading(false);
                handleExpand(2);
              }
            } else {
              setIsLoading(false);
              setDiscountInvalidError(true);
              handleExpand(2);
              return;
            }
          } catch (error) {
            console.log(error, "Update failed for draft campaign");
          }
        } else {
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.log(error, "Error Submitting form");
      }
    } else if (isEdit && !editCampaignData?.is_draft) {
      e.preventDefault();
      // when IsDraft is False, Update Campaign Data
      try {
        setDraftModal(false);
        setIsLoading(true);
        let updateCampaignSettingsId = toast.loading(
          "Updating campaign settings..."
        );
        try {
          const updateCampaignSettings = await fetch(
            `/api/campaignsettings/${campaignsid}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(editCampaignData),
            }
          );

          if (updateCampaignSettings.ok) {
            setTimeout(() => {
              toast.update(updateCampaignSettingsId, {
                render: "Updated Campaign Settings",
                type: "success",
                isLoading: true,
                position: "top-right",
                autoClose: 5000,
              });
            }, 3000);

            let updatedCamapignData = await updateCampaignSettings.json();

            // dispatch(updateCampaign(updatedCamapignData));
          } else {
            setTimeout(() => {
              toast.update(updateCampaignSettingsId, {
                render: "Failed to Update Campaign Settings",
                type: "error",
                isLoading: "false",
                autoClose: 2000,
              });
            }, 1000);

            setTimeout(() => {
              toast.dismiss(updateCampaignSettingsId);
            }, 3000);
          }
          setIsLoading(false);
          setTimeout(() => {
            toast.dismiss(updateCampaignSettingsId);
          }, 3000);
          setIsEdit(false);
          navigate("/campaigns");
        } catch (err) {
          console.log(err);
          toast.update(updateCampaignSettingsId, {
            render: "Error Updating Campaign...",
            type: "error",
            isLoading: "false",
            autoClose: 2000,
          });
          setTimeout(() => {
            toast.dismiss(updateCampaignSettingsId);
          }, 3000);
        }
      } catch (error) {
        console.log(error, "Updating Campaign settings");
      }
    } else {
      e.preventDefault();

      setDraftModal(false);
      if (
        newCampaignData?.template_id !== null &&
        selectedTemplateData !== undefined
      ) {
        setIsLoading(true);

        const discount_details = await generateDiscounts(updateCampaignData);
        // Discount Codes Generated
        if (discount_details?.success) {
          // Continue next task
          const template_details = await createTemplates(
            selectedTemplateData,
            updateCampaignData
          );

          campaignDetails = {
            ...discount_details?.data,
            ...template_details,
          };

          let campaignSettingsId = toast.loading("Saving campaign settings...");
          try {
            const campaignSetting = await fetch("/api/campaignsettings", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newCampaignData),
            });
            if (campaignSetting.ok) {
              setTimeout(() => {
                toast.update(campaignSettingsId, {
                  render: "Saved Campaign Settings",
                  type: "success",
                  isLoading: true,
                  position: "top-right",
                  autoClose: 3000,
                });
              }, 1000);
              const campaignData = await campaignSetting.json();
              setTimeout(() => {
                toast.dismiss(campaignSettingsId);
              }, 3000);
              dispatch(addNewCampaign(campaignData));
              idExists = campaignData?.campaign_id;
            } else {
              setTimeout(() => {
                toast.update(campaignSettingsId, {
                  render: "Failed to Create Campaigns",
                  type: "error",
                  isLoading: "false",
                  autoClose: 2000,
                });
              }, 1000);
              setTimeout(() => {
                toast.dismiss(campaignSettingsId);
              }, 3000);
              return "Failed to Create Campaign";
            }
          } catch (err) {
            toast.update(campaignSettingsId, {
              render: "Error Creating Campaign",
              type: "error",
              isLoading: "false",
              autoClose: 2000,
            });
            setTimeout(() => {
              toast.dismiss(campaignSettingsId);
            }, 3000);
            throw err;
          }

          // If CampaignID Exists the call the saveCampaign details function to store value in db
          if (typeof idExists == "number") {
            // If discount Codes and Template Pages created successfully
            if (campaignDetails) {
              let result = await saveCampaignDetails(campaignDetails);

              if (result) {
                dispatch(fetchCampaignDetails(result));
              }
            } else {
              setIsLoading(false);
              handleExpand(2);
              setNewCampaignData((prev) => ({ ...prev, template_id: null }));
              setDiscountInvalidError(true);
            }

            // Save the Reward Products Details for Product Discount type

            if (newCampaignData?.discount_type == "product") {
              let reward_product_details = await saveCampaignProductsDetails(
                {
                  ...selectProducts,
                  discount_type: newCampaignData?.discount_type,
                  reward_tier1_referrals: newCampaignData?.reward_1_tier,
                  reward_tier2_referrals: newCampaignData?.reward_2_tier,
                  reward_tier3_referrals: newCampaignData?.reward_3_tier,
                  reward_tier4_referrals: newCampaignData?.reward_4_tier,
                },
                idExists
              );
              if (reward_product_details) {
                console.log("Data Saved Successfully");
              }
            } else {
              setIsLoading(false);
              handleExpand(2);
            }

            setIsLoading(false);
            handleExpand(0);
            navigate("/campaigns");
          } else {
            setIsLoading(false);
            handleExpand(0);

            // throw error;
          }
        } else {
          setIsLoading(false);
          handleExpand(2);
          setNewCampaignData((prev) => ({ ...prev, template_id: null }));
        }
      } else {
        setIsLoading(false);

        return;
      }

      setIsLoading(false);
      setNewCampaignData((prev) => ({ ...prev, template_id: null }));

      handleExpand(2);
      setDiscountInvalidError(true);
    }
  };

  // save Draft Campaign details
  const saveDraftCampaignDetails = async (campaign_details) => {
    // Send POST Request to save Details From database

    let campaignDetailsId = toast.loading("Saving Discount Codes and Pages");
    if (isEdit) {
      const detailsResponse = await fetch("/api/campaigndetails", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...campaign_details,
          is_draft: true,
          is_active: false,
        }),
      });

      if (detailsResponse.ok) {
        setTimeout(() => {
          toast.update(campaignDetailsId, {
            render: "Saved discount codes and templates for campaign",
            type: "success",
            isLoading: true,
            position: "top-right",
            autoClose: 3000,
          });
        }, 1000);

        setTimeout(() => {
          toast.dismiss(campaignDetailsId);
        }, 2000);
        const detailsData = await detailsResponse.json();
        return detailsData;
      } else {
        setTimeout(() => {
          toast.update(campaignDetailsId, {
            render:
              "Error Saving Template Pages and Discount Codes for Campaign",
            type: "error",
            isLoading: true,
            position: "top-right",
            autoClose: 3000,
          });
        }, 1000);

        setTimeout(() => {
          toast.dismiss(campaignDetailsId);
        }, 2000);
        console.log("Failed to insert campaign details:", detailsResponse);
      }
    } else {
      const detailsResponse = await fetch("/api/campaigndetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...campaign_details,
          is_draft: true,
          is_active: false,
        }),
      });

      if (detailsResponse.ok) {
        setTimeout(() => {
          toast.update(campaignDetailsId, {
            render: "Saved discount codes and templates for campaign",
            type: "success",
            isLoading: true,
            position: "top-right",
            autoClose: 3000,
          });
        }, 1000);

        setTimeout(() => {
          toast.dismiss(campaignDetailsId);
        }, 2000);
        const detailsData = await detailsResponse.json();
        return detailsData;
      } else {
        setTimeout(() => {
          toast.update(campaignDetailsId, {
            render:
              "Error Saving Template Pages and Discount Codes for Campaign",
            type: "error",
            isLoading: true,
            position: "top-right",
            autoClose: 3000,
          });
        }, 1000);

        setTimeout(() => {
          toast.dismiss(campaignDetailsId);
        }, 2000);
        console.log("Failed to insert campaign details:", detailsResponse);
      }
    }
  };
  // Save Draft campaign Product Details
  const saveDraftProductDetails = async (product_details) => {
    let campaignDetailsId = toast.loading("Saving Discount Codes and Pages");
    if (isEdit) {
      try {
        const detailsResponse = await fetch("/api/campaign-product-details", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...product_details,
          }),
        });
        if (detailsResponse.ok) {
          setTimeout(() => {
            toast.update(campaignDetailsId, {
              render: "Saved discount codes and templates for campaign",
              type: "success",
              isLoading: true,
              position: "top-right",
              autoClose: 3000,
            });
          }, 1000);

          setTimeout(() => {
            toast.dismiss(campaignDetailsId);
          }, 2000);
          const detailsData = await detailsResponse.json();
          return detailsData;
        } else {
          setTimeout(() => {
            toast.update(campaignDetailsId, {
              render:
                "Error Saving Template Pages and Discount Codes for Campaign",
              type: "error",
              isLoading: true,
              position: "top-right",
              autoClose: 3000,
            });
          }, 1000);

          setTimeout(() => {
            toast.dismiss(campaignDetailsId);
          }, 2000);
          console.log(
            "Failed to insert campaign Product details:",
            detailsResponse
          );
        }
      } catch (error) {
        console.log(error, "Product saved failed");
      }
    } else {
      try {
        const detailsResponse = await fetch("/api/campaign-product-details", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...product_details,
          }),
        });

        if (detailsResponse.ok) {
          setTimeout(() => {
            toast.update(campaignDetailsId, {
              render: "Saved discount codes and templates for campaign",
              type: "success",
              isLoading: true,
              position: "top-right",
              autoClose: 3000,
            });
          }, 1000);

          setTimeout(() => {
            toast.dismiss(campaignDetailsId);
          }, 2000);
          const detailsData = await detailsResponse.json();
          return detailsData;
        } else {
          setTimeout(() => {
            toast.update(campaignDetailsId, {
              render:
                "Error Saving Template Pages and Discount Codes for Campaign",
              type: "error",
              isLoading: true,
              position: "top-right",
              autoClose: 3000,
            });
          }, 1000);

          setTimeout(() => {
            toast.dismiss(campaignDetailsId);
          }, 2000);
          console.log(
            "Failed to insert campaign Product details:",
            detailsResponse
          );
        }
      } catch (error) {
        console.log(error, "Product saved failed");
      }
    }
  };
  // Save Draft Campaign data to database
  const onDraftSave = async () => {
    let draftCampaignId, draftCampaign;
    if (isEdit) {
      // Update Campaign Details saved in Draft
      if (draftModal === true) {
        try {
          const response = await fetch(
            `/api/campaignsettings/${campaignById?.campaign_id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updateCampaignData),
            }
          );

          if (response.ok) {
            draftCampaign = await response.json();
            console.log(draftCampaign, "Draft campaign");
            draftCampaignId = draftCampaign?.campaign_id;
          } else {
            console.log("Failed to save Campaign Drfat");
          }

          const campaignDetails = {
            campaign_name: draftCampaign?.name,
            theme_id: null,
            landing_template_key: "",
            landing_template_link: "",
            landing_page_id: "",
            landing_page_link: "",
            rewards_template_key: "",
            rewards_template_link: "",
            rewards_page_id: "",
            rewards_page_link: "",
          };

          let RewardProductDetails = {
            ...selectProducts,
            campaign_id: draftCampaign?.campaign_id,
            discount_type: draftCampaign?.discount_type,
            reward_tier1_referrals: draftCampaign?.reward_1_tier,
            reward_tier2_referrals: draftCampaign?.reward_2_tier,
            reward_tier3_referrals: draftCampaign?.reward_3_tier,
            reward_tier4_referrals: draftCampaign?.reward_4_tier,
            launchProductTitle: updateCampaignData?.launchProductTitle,
            launchProductId: updateCampaignData?.launchProductId,
            tier1ProductName: updateCampaignData?.tier1ProductName,
            tier1ProductId: updateCampaignData?.tier1ProductId,
            tier2ProductName: updateCampaignData?.tier2ProductName,
            tier2ProductId: updateCampaignData?.tier2ProductId,
            tier3ProductName: updateCampaignData?.tier3ProductName,
            tier3ProductId: updateCampaignData?.tier3ProductId,
            tier4ProductName: updateCampaignData?.tier4ProductName,
            tier4ProductId: updateCampaignData?.tier4ProductId,
          };
          if (typeof draftCampaignId == "number") {
            let result = await saveDraftCampaignDetails(campaignDetails);
            if (result) {
              dispatch(addNewCampaignDetails(result[0]));
            } else {
              console.log("no result Found");
            }

            if (editCampaignData?.discount_type == "product") {
              let productDetails = await saveDraftProductDetails({
                ...RewardProductDetails,
              });
              console.log(productDetails, "saved details of products");

              if (productDetails) {
                console.log("Saved data in product details");
              }
            }
          }
        } catch (err) {
          console.log(err, "Failed to save Campaign Drfat");
        }
      } else {
        return;
      }
    } else {
      if (draftModal === true) {
        try {
          const response = await fetch("/api/campaignsettings", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateCampaignData),
          });

          if (response.ok) {
            draftCampaign = await response.json();
            console.log(draftCampaign, "Draft campaign");
            draftCampaignId = draftCampaign?.campaign_id;
          } else {
            console.log("Failed to save Campaign Drfat");
          }

          const campaignDetails = {
            campaign_name: draftCampaign?.name,
            theme_id: null,
            landing_template_key: "",
            landing_template_link: "",
            landing_page_id: "",
            landing_page_link: "",
            rewards_template_key: "",
            rewards_template_link: "",
            rewards_page_id: "",
            rewards_page_link: "",
          };

          let RewardProductDetails = {
            ...selectProducts,
            campaign_id: draftCampaign?.campaign_id,
            discount_type: draftCampaign?.discount_type,
            reward_tier1_referrals: draftCampaign?.reward_1_tier,
            reward_tier2_referrals: draftCampaign?.reward_2_tier,
            reward_tier3_referrals: draftCampaign?.reward_3_tier,
            reward_tier4_referrals: draftCampaign?.reward_4_tier,
          };
          if (typeof draftCampaignId == "number") {
            let result = await saveDraftCampaignDetails(campaignDetails);
            if (result) {
              dispatch(addNewCampaignDetails(result[0]));
            } else {
              console.log("no result Found");
            }

            if (newCampaignData?.discount_type == "product") {
              let productDetails = await saveDraftProductDetails({
                ...RewardProductDetails,
              });
              console.log(productDetails);

              if (productDetails) {
                console.log("Saved data in product details");
              }
            }
          }
        } catch (err) {
          console.log(err, "Failed to save Campaign Drfat");
        }
      } else {
        return;
      }
    }
  };

  return (
    <>
      {((myPlan == "Free" && TotalCampaign?.length >= 1) ||
        (myPlan == "Tier 1" && TotalCampaign?.length >= 2)) &&
      !isEdit ? (
        <div className="upgrade-container">
          <p>
            You already have {TotalCampaign?.length} Active Campaign
            {TotalCampaign?.length > 1 && "s"}
          </p>
          <p>Upgrade Your Account to create unlimited campaigns </p>
          <button className="upgrade-btn" onClick={() => navigate("/price")}>
            Upgrade Plan
          </button>
        </div>
      ) : (
        <div className="new-campaign-container">
          <div className="newcampaign-title">
            <h1>{isEdit ? "Edit Campaign" : "New Campaign"}</h1>
          </div>

          <Suspense fallback={<skeletonPageLoad />}>
            <SaveDraft
              openModal={showPrompt}
              confirmNavigation={confirmNavigation}
              cancelNavigation={cancelNavigation}
              handleSaveDraft={onDraftSave}
            />
          </Suspense>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick={true}
            draggable
            theme="colored"
          />
          <form onSubmit={onSubmit}>
            {/* Basic Settings Input Form Section  */}
            <section className="newcampaign-settings">
              <div
                className={`basic-form-settings ${
                  expanded[0] ? "active-card" : "inactive-card"
                }`}
                onClick={() => handleExpand(0)}
              >
                <div className="card-header">
                  <h2 className="card-title">Basic Settings</h2>
                  <span className="toggle-btn" onClick={() => handleExpand(0)}>
                    {expanded[0] ? (
                      <IoIosArrowUp
                        style={{ strokeWidth: "70", fill: "#fff" }}
                        onClick={() => handleExpand(0)}
                      />
                    ) : (
                      <IoIosArrowDown
                        style={{ strokeWidth: "70", fill: "#fff" }}
                        onClick={() => handleExpand(0)}
                      />
                    )}
                  </span>
                </div>
              </div>
              {expanded[0] && (
                <>
                  <div className="campaign-form">
                    <div className="input-form-groups">
                      <div className="form-group">
                        <div className="inputfield">
                          <label htmlFor="name">
                            Campaign Name
                            {formErrors?.requiredInputName && (
                              <span className="error-message">
                                Please Enter Campaign Name
                              </span>
                            )}
                          </label>

                          {isEdit ? (
                            <>
                              <input
                                type="text"
                                name="name"
                                id="name"
                                value={editCampaignData?.name}
                                readOnly={isEdit && !editCampaignData?.is_draft}
                                required={editCampaignData?.name === ""}
                                onChange={
                                  editCampaignData?.is_draft
                                    ? handleChange
                                    : undefined
                                }
                              />
                              {formErrors?.campaignNameError && (
                                <p className="error-message">
                                  Campaign Name already Taken
                                </p>
                              )}
                            </>
                          ) : (
                            <>
                              <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Campaign Name"
                                value={newCampaignData?.name}
                                onChange={handleChange}
                                required
                              />

                              {formErrors?.campaignNameError && (
                                <p className="error-message">
                                  Campaign Name already Taken
                                </p>
                              )}
                            </>
                          )}
                        </div>

                        <div className="inputfield">
                          <label htmlFor="product">Product Link</label>
                          {isEdit ? (
                            <div className="select-products">
                              <select
                                name="product"
                                id="product"
                                value={editCampaignData?.product}
                                disabled={isEdit && !editCampaignData?.is_draft}
                                readOnly={isEdit && !editCampaignData?.is_draft}
                                onChange={
                                  editCampaignData?.is_draft
                                    ? handleChange
                                    : undefined
                                }
                              >
                                {isEdit && !editCampaignData?.is_draft ? (
                                  <option value={editCampaignData?.product}>
                                    {editCampaignData?.product}
                                  </option>
                                ) : isEdit && editCampaignData?.is_draft ? (
                                  <>
                                    <option value={editCampaignData?.product}>
                                      {editCampaignData?.product}
                                    </option>{" "}
                                    {getProducts?.productsList
                                      ?.filter(
                                        (prod) =>
                                          !excludeProducts?.includes(prod.title)
                                      )
                                      ?.map((item) => {
                                        return (
                                          <option
                                            value={item.title}
                                            key={item.id}
                                          >
                                            {item.title}
                                          </option>
                                        );
                                      })}
                                  </>
                                ) : (
                                  <>
                                    <option></option>
                                    {getProducts?.productsList?.map((item) => {
                                      return (
                                        <option
                                          value={item.title}
                                          key={item.id}
                                        >
                                          {item.title}
                                        </option>
                                      );
                                    })}
                                  </>
                                )}
                              </select>
                            </div>
                          ) : (
                            <div className="select-products">
                              <select
                                name="product"
                                id="product"
                                placeholder="T-Shirts"
                                value={newCampaignData?.product}
                                onChange={handleChange}
                              >
                                {" "}
                                <option></option>{" "}
                                {/* <option disabled>Select</option>{" "} */}
                                {getProducts?.productsList?.map((item) => {
                                  return (
                                    <option value={item.title} key={item.id}>
                                      {item.title}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="inputfield">
                          <label htmlFor="start_date">Start Date</label>

                          {isEdit ? (
                            <DatePicker
                              minDate={new Date()}
                              maxDate={editCampaignData?.end_date}
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
                                  ["start_date"]: date,
                                }))
                              }
                            />
                          ) : (
                            <DatePicker
                              name="start_date"
                              minDate={new Date()}
                              maxDate={newCampaignData?.end_date}
                              showDisabledMonthNavigation
                              customInput={<ExampleCustomInput />}
                              shouldCloseOnSelect={true}
                              selected={newCampaignData?.start_date}
                              value={newCampaignData?.start_date}
                              onChange={(date) =>
                                setNewCampaignData((prev) => ({
                                  ...prev,
                                  ["start_date"]: date,
                                }))
                              }
                            />
                          )}
                        </div>

                        <div className="inputfield">
                          <label htmlFor="end_date">End Date</label>
                          {isEdit ? (
                            <DatePicker
                              minDate={
                                editCampaignData?.start_date || new Date()
                              }
                              customInput={<ExampleCustomInput />}
                              showDisabledMonthNavigation
                              shouldCloseOnSelect={true}
                              selected={
                                editCampaignData?.end_date
                                  ? new Date(editCampaignData?.end_date)
                                  : null
                              }
                              value={
                                editCampaignData?.end_date
                                  ? new Date(editCampaignData?.end_date)
                                  : null
                              }
                              onChange={(date) =>
                                setEditCampaignData((prev) => ({
                                  ...prev,
                                  ["end_date"]: date,
                                }))
                              }
                            />
                          ) : (
                            <DatePicker
                              name="end_date"
                              minDate={
                                newCampaignData?.start_date || new Date()
                              }
                              customInput={<ExampleCustomInput />}
                              showDisabledMonthNavigation
                              shouldCloseOnSelect={true}
                              selected={newCampaignData?.end_date}
                              value={newCampaignData?.end_date}
                              onChange={(date) =>
                                setNewCampaignData((prev) => ({
                                  ...prev,
                                  ["end_date"]: date,
                                }))
                              }
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Store's Social Links */}
                    <div className="store-links">
                      <h2 className="sub-heading">
                        Share Store's Social Media Links
                      </h2>
                      <div className="store-social-links">
                        {storeLinks.map((link) => (
                          <div className="social-input-form" key={link.id}>
                            {isEdit ? (
                              <input
                                className="social-input"
                                type="checkbox"
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
                                className="social-input"
                                type="checkbox"
                                name={`show_${link?.name}`}
                                checked={newCampaignData[`show_${link?.name}`]}
                                onChange={handleCheckboxChange}
                              />
                            )}
                            <span className="store-social-icons">
                              {link.icon}
                            </span>
                            {isEdit ? (
                              <input
                                className="social-inputfield"
                                type="text"
                                name={`${link?.name}`}
                                value={editCampaignData[`${link?.name}`]}
                                onChange={handleChange}
                              />
                            ) : (
                              <input
                                className="social-inputfield"
                                type="text"
                                name={`${link?.name}`}
                                value={newCampaignData[`${link?.name}`]}
                                onChange={handleChange}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="collect-setup">
                      <div className="collect-settings">
                        <h2 className="sub-heading">Collect</h2>
                        <div>
                          {isEdit ? (
                            <input
                              className="checkbox-input"
                              type="radio"
                              name="collect_phone"
                              value="phone"
                              checked={editCampaignData?.collect_phone === true}
                              disabled={!current_plan?.collecting_phones}
                              onChange={handleRadioChange}
                            />
                          ) : (
                            <input
                              className="checkbox-input"
                              type="radio"
                              name="collect_phone"
                              value="phone"
                              checked={newCampaignData?.collect_phone == true}
                              disabled={!current_plan?.collecting_phones}
                              onChange={handleRadioChange}
                            />
                          )}
                          <label htmlFor="collect_phone">
                            Email Addresses and Phone Numbers{" "}
                          </label>
                        </div>

                        <div>
                          {isEdit ? (
                            <input
                              className="checkbox-input"
                              type="radio"
                              name="collect_phone"
                              value="email"
                              // checked={
                              //   !current_plan?.collect_phone
                              //     ? true
                              //     : editCampaignData?.collect_phone === true
                              // }
                              checked={
                                editCampaignData?.collect_phone === false
                              }
                              // disabled={!current_plan?.collecting_phone}
                              onChange={handleRadioChange}
                            />
                          ) : (
                            <input
                              className="checkbox-input"
                              type="radio"
                              name="collect_phone"
                              value="email"
                              // disabled={!current_plan?.collecting_phone}
                              // checked={
                              //   !current_plan?.collect_phone
                              //     ? true
                              //     : newCampaignData?.collect_phone == false
                              // }

                              checked={newCampaignData?.collect_phone === false}
                              onChange={handleRadioChange}
                            />
                          )}
                          <label htmlFor="collect_phone">
                            Email Addresses only
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="next-btn-toggle">{renderButton(1)}</div>
                </>
              )}
            </section>

            {/* Referral Settings */}
            <section className="newcampaign-settings">
              <div
                className={`referrals-settings ${
                  expanded[1] ? "active-card" : "inactive-card"
                }`}
                //  onClick={() => handleExpand(1)}
              >
                <div className="card-header">
                  <h2 className="card-title">Referral Settings</h2>
                  <span
                    className="toggle-btn"
                    // onClick={() => handleExpand(1)}
                  >
                    {expanded[1] ? (
                      <IoIosArrowUp
                        style={{ strokeWidth: "70", fill: "#fff" }}
                        onClick={() => handleExpand(1)}
                      />
                    ) : (
                      <IoIosArrowDown
                        disabled={expanded[0]}
                        style={{ strokeWidth: "70", fill: "#fff" }}
                        onClick={() => handleExpand(1)}
                      />
                    )}
                  </span>
                </div>
              </div>

              {expanded[1] && (
                <>
                  <div className="referral-settings-form">
                    <div className="referral-container">
                      <p>
                        Select the Social Media channels that you want to allow
                        your customers to share their referral link with!
                        <br /> You can also customise the message that you would
                        want your customers to share!
                      </p>
                    </div>
                    <div className="social-links-container">
                      {integratelinks?.map((link) => (
                        <div className="social_block" key={link?.id}>
                          <div className="social-section">
                            <div className="social-title">
                              <span className="social-icons">{link?.icon}</span>
                            </div>

                            <div className="check-input">
                              {isEdit ? (
                                <input
                                  type="checkbox"
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
                                  type="checkbox"
                                  name={`share_${link?.title}_referral`}
                                  id={`share_${link?.title}_referral`}
                                  checked={
                                    newCampaignData[
                                      `share_${link?.title}_referral`
                                    ]
                                  }
                                  onChange={handleCheckboxChange}
                                />
                              )}{" "}
                              <label htmlFor="">{link?.desc}</label>
                            </div>

                            <div className="referral-link-input">
                              {isEdit ? (
                                <textarea
                                  className="referral-input"
                                  name={`share_${link?.title}_message`}
                                  rows={4}
                                  value={
                                    editCampaignData[
                                      `share_${link?.title}_message`
                                    ]
                                  }
                                  onChange={handleChange}
                                />
                              ) : (
                                <textarea
                                  className="referral-input"
                                  name={`share_${link?.title}_message`}
                                  rows={4}
                                  value={
                                    newCampaignData[
                                      `share_${link?.title}_message`
                                    ]
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
                  <div className="referral-nextbtn">
                    <>
                      <button
                        className="prevBtn"
                        onClick={() => handlePrevious(0)}
                      >
                        Previous
                      </button>
                      <button className="nextBtn" onClick={() => handleNext(2)}>
                        Next
                      </button>
                    </>
                  </div>
                </>
              )}
            </section>

            {/* Reward Settings */}

            <section className="newcampaign-settings">
              <div
                className={`rewards-settings ${
                  expanded[2] ? "active-card" : "inactive-card"
                }`}
                // onClick={() => handleExpand(2)}
              >
                <div className="card-header">
                  <h2 className="card-title">Reward Settings</h2>
                  <span className="toggle-btn" onClick={() => handleExpand(2)}>
                    {expanded[2] ? (
                      <IoIosArrowUp
                        style={{ strokeWidth: "70", fill: "#fff" }}
                        onClick={() => handleExpand(2)}
                      />
                    ) : (
                      <IoIosArrowDown
                        style={{ strokeWidth: "70", fill: "#fff" }}
                        // onClick={() => handleExpand(2)}
                      />
                    )}
                  </span>
                </div>
              </div>

              {expanded[2] && (
                <>
                  <div className="rewards-settings-form">
                    <p>
                      Set up the Rewards for your customers here! Select the
                      discount type and then the reward tiers!
                    </p>
                    <p>
                      Note: Discount will not be applicable on Shipping. Each
                      code can be used by a customer only once.
                    </p>

                    <div className="rewards-settings-container">
                      <h2 className="sub-heading">Discount</h2>
                      <div className="discount-settings">
                        <div>
                          {isEdit ? (
                            <input
                              className="social-radioInput"
                              type="radio"
                              name="discount_type"
                              value="percent"
                              checked={
                                editCampaignData?.discount_type === "percent"
                              }
                              readOnly={isEdit && !editCampaignData?.is_draft}
                              onChange={
                                isEdit && editCampaignData?.is_draft
                                  ? handleDiscountRadioChange
                                  : undefined
                              }
                            />
                          ) : (
                            <input
                              className="social-radioInput"
                              type="radio"
                              name="discount_type"
                              value="percent"
                              checked={
                                newCampaignData?.discount_type === "percent"
                              }
                              onChange={handleDiscountRadioChange}
                            />
                          )}
                          <label htmlFor="">% off the entire order</label>
                        </div>
                        <div>
                          {isEdit ? (
                            <input
                              className="social-radioInput"
                              type="radio"
                              name="discount_type"
                              value="amount"
                              checked={
                                editCampaignData?.discount_type === "amount"
                              }
                              readOnly={isEdit && !editCampaignData?.is_draft}
                              onChange={
                                isEdit && editCampaignData?.is_draft
                                  ? handleDiscountRadioChange
                                  : undefined
                              }
                            />
                          ) : (
                            <input
                              className="social-radioInput"
                              type="radio"
                              name="discount_type"
                              value="amount"
                              checked={
                                newCampaignData?.discount_type === "amount"
                              }
                              onChange={handleDiscountRadioChange}
                            />
                          )}{" "}
                          <label htmlFor="">$ off the entire order</label>
                        </div>
                        <div>
                          {isEdit ? (
                            <input
                              className="social-radioInput"
                              type="radio"
                              name="discount_type"
                              value="product"
                              checked={
                                editCampaignData?.discount_type === "product"
                              }
                              readOnly={isEdit && !editCampaignData?.is_draft}
                              onChange={
                                isEdit && editCampaignData?.is_draft
                                  ? handleDiscountRadioChange
                                  : undefined
                              }
                            />
                          ) : (
                            <input
                              className="social-radioInput"
                              type="radio"
                              name="discount_type"
                              value="product"
                              checked={
                                newCampaignData?.discount_type === "product"
                              }
                              onChange={handleDiscountRadioChange}
                            />
                          )}{" "}
                          <label htmlFor="">Free Product giveaway</label>
                        </div>
                      </div>
                    </div>

                    {/* Reward Tier 1 and 2 must be filled validation error */}
                    {rewardTierValidate && (
                      <h6 className="validation">
                        <MdError
                          style={{ height: 18, width: 18, marginRight: 5 }}
                        />
                        Reward Tier 1 and Tier 2 must be Filled
                      </h6>
                    )}

                    {/* Reward Tiers contains duplicates discount codes  when submitting form */}
                    {discountInvalidError && (
                      <h6 className="validation">
                        <MdError
                          style={{ height: 18, width: 18, marginRight: 5 }}
                        />
                        Discount Codes already Exists On Store, Please enter
                        another codes
                      </h6>
                    )}

                    {/* Validate Launch Product is Selected or not when Selecting discount type is Free Product */}
                    {formErrors?.LaunchProductError && (
                      <>
                        <span className="product-validation">
                          <MdError
                            style={{ height: 18, width: 18, marginRight: 5 }}
                          />
                          Select the Launch Product first in Basic Settings form{" "}
                          <h5 onClick={() => handleNext(0)}>Select Product</h5>
                        </span>
                      </>
                    )}

                    {/* Rewards Section Form */}
                    <div className="rewards-container">
                      {RewardData.map((reward) => (
                        <div key={reward.id} className="reward-card">
                          <div classname="reward-tier-card">
                            <div className="reward-title">
                              <h2>{reward.title}</h2>
                              <span>
                                {" "}
                                {reward.is_required === true && "(Required)"}
                              </span>
                            </div>

                            <div className="reward-content">
                              {/* Required Rewards and Valid Discount codes values */}
                              <div className="reward-form-error">
                                {isReward2Error && reward?.id === 2 && (
                                  <h6 className="discount_code-error">
                                    {" "}
                                    <MdError
                                      style={{
                                        height: 18,
                                        width: 18,
                                        marginRight: 5,
                                      }}
                                    />
                                    {`Discount Value must be higher than Tier ${
                                      reward?.id - 1
                                    }`}
                                  </h6>
                                )}
                                {isReward3Error && reward?.id === 3 && (
                                  <h6 className="discount_code-error">
                                    {" "}
                                    <MdError
                                      style={{
                                        height: 18,
                                        width: 18,
                                        marginRight: 5,
                                      }}
                                    />
                                    {`Discount Value must be higher than Tier ${
                                      reward?.id - 1
                                    }`}
                                  </h6>
                                )}
                                {isReward4Error && reward?.id === 4 && (
                                  <h6 className="discount_code-error">
                                    {" "}
                                    <MdError
                                      style={{
                                        height: 18,
                                        width: 18,
                                        marginRight: 5,
                                      }}
                                    />
                                    {`Discount Value must be higher than Tier ${
                                      reward?.id - 1
                                    }`}
                                  </h6>
                                )}
                              </div>
                              {/* Reward Setting form for Amount/Percent Discount Types */}

                              {newCampaignData?.discount_type != "product" &&
                              editCampaignData?.discount_type != "product" ? (
                                <div className="reward-form">
                                  <div className="inputfield">
                                    <label
                                      htmlFor={`reward_${reward?.id}_tier`}
                                    >
                                      No of Referrals
                                    </label>
                                    {isEdit ? (
                                      <input
                                        className="small-inputfield"
                                        type="number"
                                        name={`reward_${reward?.id}_tier`}
                                        min={
                                          editCampaignData?.discount_type ===
                                          "percent"
                                            ? 1
                                            : 1
                                        }
                                        max={
                                          editCampaignData?.discount_type ===
                                          "percent"
                                            ? 100
                                            : null
                                        }
                                        value={
                                          editCampaignData[
                                            `reward_${reward?.id}_tier`
                                          ]
                                        }
                                        onChange={
                                          isEdit && editCampaignData?.is_draft
                                            ? handleChange
                                            : undefined
                                        }
                                        disabled={
                                          isEdit && !editCampaignData?.is_draft
                                        }
                                      />
                                    ) : (
                                      <input
                                        className="small-inputfield"
                                        type="number"
                                        min={
                                          newCampaignData?.discount_type ===
                                          "percent"
                                            ? 1
                                            : 1
                                        }
                                        max={
                                          newCampaignData?.discount_type ===
                                          "percent"
                                            ? 100
                                            : null
                                        }
                                        name={`reward_${reward?.id}_tier`}
                                        value={
                                          newCampaignData[
                                            `reward_${reward?.id}_tier`
                                          ]
                                        }
                                        onChange={handleChange}
                                        disabled={
                                          isFieldDisabled(reward?.id) ||
                                          (reward?.id > 1 &&
                                            reward?.id < 4 &&
                                            !newCampaignData[
                                              `reward_${reward?.id - 1}_tier`
                                            ])
                                        }
                                      />
                                    )}
                                  </div>
                                  <div className="inputfield">
                                    <label
                                      htmlFor={`reward_${reward?.id}_discount`}
                                    >
                                      Discount
                                    </label>
                                    {isEdit ? (
                                      <input
                                        className="small-inputfield"
                                        type="number"
                                        name={`reward_${reward?.id}_discount`}
                                        value={
                                          editCampaignData[
                                            `reward_${reward?.id}_discount`
                                          ]
                                        }
                                        onChange={
                                          isEdit && editCampaignData?.is_draft
                                            ? handleChange
                                            : undefined
                                        }
                                        disabled={
                                          isEdit && !editCampaignData?.is_draft
                                        }
                                      />
                                    ) : (
                                      <input
                                        className="small-inputfield"
                                        type="number"
                                        min={
                                          newCampaignData?.discount_type ===
                                          "percent"
                                            ? 1
                                            : 1
                                        }
                                        max={
                                          newCampaignData?.discount_type ===
                                          "percent"
                                            ? 100
                                            : null
                                        }
                                        name={`reward_${reward?.id}_discount`}
                                        value={
                                          newCampaignData[
                                            `reward_${reward?.id}_discount`
                                          ]
                                        }
                                        onChange={handleChange}
                                        disabled={
                                          isFieldDisabled(reward?.id) ||
                                          (reward?.id > 1 &&
                                            reward?.id < 4 &&
                                            !newCampaignData[
                                              `reward_${
                                                reward?.id - 1
                                              }_discount`
                                            ])
                                          // ||(reward?.id === 2 && !isTier1Filled) || (reward?.id === 4 && !isTier3Filled)
                                        }
                                        // disabled={reward?.id > 1 && reward?.id < 4 && !newCampaignData[`reward_${reward?.id - 1}_discount`]}
                                      />
                                    )}
                                  </div>

                                  <div className="inputfield">
                                    <label
                                      htmlFor={`reward_${reward?.id}_code`}
                                    >
                                      Discount Code
                                    </label>
                                    {isEdit ? (
                                      <input
                                        className="large-field"
                                        type="text"
                                        name={`reward_${reward?.id}_code`}
                                        value={
                                          editCampaignData[
                                            `reward_${reward?.id}_code`
                                          ]
                                        }
                                        onChange={
                                          isEdit && editCampaignData?.is_draft
                                            ? handleChange
                                            : undefined
                                        }
                                        disabled={
                                          isEdit && !editCampaignData?.is_draft
                                        }
                                      />
                                    ) : (
                                      <input
                                        className="large-field"
                                        type="text"
                                        name={`reward_${reward?.id}_code`}
                                        value={
                                          newCampaignData[
                                            `reward_${reward?.id}_code`
                                          ]
                                        }
                                        onChange={handleChange}
                                        disabled={
                                          isFieldDisabled(reward?.id) ||
                                          (reward?.id > 1 &&
                                            reward?.id < 4 &&
                                            !newCampaignData[
                                              `reward_${reward?.id - 1}_code`
                                            ])
                                        }
                                      />
                                    )}
                                  </div>
                                </div>
                              ) : (
                                // Reward Settings Form For Free Product Reward
                                <div className="reward-form">
                                  <div className="inputfield">
                                    <label
                                      htmlFor={`reward_${reward?.id}_tier`}
                                    >
                                      No of Referrals
                                    </label>
                                    {isEdit ? (
                                      <input
                                        className="small-inputfield"
                                        type="number"
                                        name={`reward_${reward?.id}_tier`}
                                        value={
                                          editCampaignData[
                                            `reward_${reward?.id}_tier`
                                          ]
                                        }
                                        onChange={
                                          isEdit && editCampaignData?.is_draft
                                            ? handleChange
                                            : undefined
                                        }
                                        disabled={
                                          isEdit && !editCampaignData?.is_draft
                                        }
                                      />
                                    ) : (
                                      <input
                                        className="small-inputfield"
                                        type="number"
                                        min={
                                          newCampaignData?.discount_type ===
                                          "percent"
                                            ? 1
                                            : 1
                                        }
                                        max={
                                          newCampaignData?.discount_type ===
                                          "percent"
                                            ? 100
                                            : null
                                        }
                                        name={`reward_${reward?.id}_tier`}
                                        value={
                                          newCampaignData[
                                            `reward_${reward?.id}_tier`
                                          ]
                                        }
                                        onChange={handleChange}
                                        disabled={
                                          formErrors?.LaunchProductError ||
                                          isProductFieldDisabled(reward?.id) ||
                                          (reward?.id > 1 &&
                                            reward?.id < 4 &&
                                            !newCampaignData[
                                              `reward_${reward?.id - 1}_tier`
                                            ])
                                        }
                                      />
                                    )}
                                  </div>

                                  <div className="inputfield">
                                    <label
                                      htmlFor={`reward_${reward?.id}_product`}
                                    >
                                      Select Free Product
                                    </label>
                                    {isEdit ? (
                                      <div className="product-tier">
                                        <select
                                          type="text"
                                          name={`reward_${reward?.id}_product`}
                                          value={
                                            editCampaignData[
                                              `reward_${reward?.id}_product`
                                            ]
                                          }
                                          onChange={
                                            editCampaignData?.is_draft
                                              ? handleChange
                                              : undefined
                                          }
                                          disabled={
                                            formErrors?.LaunchProductError ||
                                            (isEdit &&
                                              !editCampaignData?.is_draft)
                                          }
                                        >
                                          {isEdit &&
                                          !editCampaignData?.is_draft ? (
                                            <option>
                                              {
                                                editCampaignData[
                                                  `reward_${reward?.id}_product`
                                                ]
                                              }
                                            </option>
                                          ) : (
                                            <>
                                              <option></option>
                                              {getProducts?.filteredTierProducts
                                                .filter((item) => {
                                                  // Check if the item is not selected in any previous tier
                                                  for (
                                                    let i = 1;
                                                    i < reward?.id;
                                                    i++
                                                  ) {
                                                    if (
                                                      item.title ===
                                                      selectProducts[
                                                        `tier${i}ProductName`
                                                      ]
                                                    ) {
                                                      return false;
                                                    }
                                                  }
                                                  return true;
                                                })
                                                .map((item) => (
                                                  <option
                                                    value={item.title}
                                                    key={item.id}
                                                  >
                                                    {item.title}
                                                  </option>
                                                ))}
                                            </>
                                          )}
                                        </select>
                                      </div>
                                    ) : (
                                      <div className="product-tier">
                                        <select
                                          type="text"
                                          name={`reward_${reward?.id}_product`}
                                          value={
                                            newCampaignData[
                                              `reward_${reward?.id}_product`
                                            ]
                                          }
                                          onChange={handleChange}
                                          disabled={
                                            formErrors?.LaunchProductError ||
                                            isProductFieldDisabled(
                                              reward?.id
                                            ) ||
                                            (reward?.id > 1 &&
                                              reward?.id < 4 &&
                                              !newCampaignData[
                                                `reward_${
                                                  reward?.id - 1
                                                }_product`
                                              ])
                                          }
                                        >
                                          <option></option>{" "}
                                          {getProducts?.filteredTierProducts
                                            .filter((item) => {
                                              // Check if the item is not selected in any previous tier
                                              for (
                                                let i = 1;
                                                i < reward?.id;
                                                i++
                                              ) {
                                                if (
                                                  item.title ===
                                                  selectProducts[
                                                    `tier${i}ProductName`
                                                  ]
                                                ) {
                                                  return false;
                                                }
                                              }
                                              return true;
                                            })
                                            .map((item) => (
                                              <option
                                                value={item.title}
                                                key={item.id}
                                              >
                                                {item.title}
                                              </option>
                                            ))}
                                        </select>
                                      </div>
                                    )}
                                  </div>
                                  <div className="inputfield">
                                    <label
                                      htmlFor={`reward_${reward?.id}_code`}
                                    >
                                      Discount Code
                                    </label>
                                    {isEdit ? (
                                      <input
                                        className="large-field"
                                        type="text"
                                        name={`reward_${reward?.id}_code`}
                                        value={
                                          editCampaignData[
                                            `reward_${reward?.id}_code`
                                          ]
                                        }
                                        onChange={
                                          isEdit && editCampaignData?.is_draft
                                            ? handleChange
                                            : undefined
                                        }
                                        disabled={
                                          isEdit && !editCampaignData?.is_draft
                                        }
                                      />
                                    ) : (
                                      <input
                                        className="large-field"
                                        type="text"
                                        name={`reward_${reward?.id}_code`}
                                        value={
                                          newCampaignData[
                                            `reward_${reward?.id}_code`
                                          ]
                                        }
                                        onChange={handleChange}
                                        disabled={
                                          formErrors?.LaunchProductError ||
                                          isProductFieldDisabled(reward?.id) ||
                                          (reward?.id > 1 &&
                                            reward?.id < 4 &&
                                            !newCampaignData[
                                              `reward_${reward?.id - 1}_tier`
                                            ])
                                        }
                                      />
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Duplicates Discount Codes Error */}
                              <div>
                                {
                                  // newCampaignData?.discount_type != "product" &&
                                  discountCode1 === true &&
                                    reward?.id === 1 && (
                                      <h6 className="discount_error_text">
                                        <MdError
                                          style={{
                                            height: 16,
                                            width: 16,
                                            marginRight: 5,
                                          }}
                                        />
                                        {`Discount Code for Tier ${reward?.id} Already Exists`}
                                      </h6>
                                    )
                                }
                                {
                                  // newCampaignData?.discount_type != "product" &&
                                  discountCode2 === true &&
                                    reward?.id === 2 && (
                                      <h6 className="discount_error_text">
                                        <MdError
                                          style={{
                                            height: 16,
                                            width: 16,
                                            marginRight: 5,
                                          }}
                                        />
                                        {`Discount Code for Tier ${reward?.id} Already Exists`}
                                      </h6>
                                    )
                                }
                                {
                                  // newCampaignData?.discount_type != "product" &&
                                  discountCode3 === true &&
                                    reward?.id === 3 && (
                                      <h6 className="discount_error_text">{`Discount Code for Tier ${reward?.id} Already Exists`}</h6>
                                    )
                                }

                                {newCampaignData?.discount_type != "product"
                                  ? (newCampaignData?.reward_3_tier ||
                                      newCampaignData?.reward_3_discount) &&
                                    !isReward3Filled &&
                                    reward?.id === 3 && (
                                      <h6 className="discount_error_text">
                                        <MdError
                                          style={{
                                            height: 16,
                                            width: 16,
                                            marginRight: 5,
                                          }}
                                        />
                                        {`Please Fill out all Fields for Tier ${reward?.id} `}
                                      </h6>
                                    )
                                  : (newCampaignData?.reward_3_tier ||
                                      newCampaignData?.reward_3_product) &&
                                    !isReward3ProductFilled &&
                                    reward?.id === 3 && (
                                      <h6 className="discount_error_text">
                                        <MdError
                                          style={{
                                            height: 16,
                                            width: 16,
                                            marginRight: 5,
                                          }}
                                        />
                                        {`Please Fill out all Fields for Tier ${reward?.id} `}
                                      </h6>
                                    )}

                                {editCampaignData?.discount_type != "product"
                                  ? (editCampaignData?.reward_3_tier ||
                                      editCampaignData?.reward_3_discount) &&
                                    !isReward3Filled &&
                                    reward?.id === 3 && (
                                      <h6 className="discount_error_text">
                                        <MdError
                                          style={{
                                            height: 16,
                                            width: 16,
                                            marginRight: 5,
                                          }}
                                        />
                                        {`Please Fill out all Fields for Tier ${reward?.id} `}
                                      </h6>
                                    )
                                  : (editCampaignData?.reward_3_tier ||
                                      editCampaignData?.reward_3_product) &&
                                    !isReward3ProductFilled &&
                                    reward?.id === 3 && (
                                      <h6 className="discount_error_text">
                                        <MdError
                                          style={{
                                            height: 16,
                                            width: 16,
                                            marginRight: 5,
                                          }}
                                        />
                                        {`Please Fill out all Fields for Tier ${reward?.id} `}
                                      </h6>
                                    )}

                                {
                                  // newCampaignData?.discount_type != "product" &&
                                  discountCode4 === true &&
                                    reward?.id === 4 && (
                                      <h6 className="discount_error_text">
                                        <MdError
                                          style={{
                                            height: 16,
                                            width: 16,
                                            marginRight: 5,
                                          }}
                                        />
                                        {`Discount Code for Tier ${reward?.id} Already Exists`}
                                      </h6>
                                    )
                                }

                                {newCampaignData?.discount_type != "product"
                                  ? (newCampaignData?.reward_4_tier ||
                                      newCampaignData?.reward_4_discount) &&
                                    !isReward4Filled &&
                                    reward?.id === 4 && (
                                      <h6 className="discount_error_text">
                                        <MdError
                                          style={{
                                            height: 16,
                                            width: 16,
                                            marginRight: 5,
                                          }}
                                        />
                                        {`Please Fill out all Fields for Tier ${reward?.id} `}
                                      </h6>
                                    )
                                  : (newCampaignData?.reward_4_tier ||
                                      newCampaignData?.reward_4_product) &&
                                    !isReward4ProductFilled &&
                                    reward?.id === 4 && (
                                      <h6 className="discount_error_text">
                                        <MdError
                                          style={{
                                            height: 16,
                                            width: 16,
                                            marginRight: 5,
                                          }}
                                        />
                                        {`Please Fill out all Fields for Tier ${reward?.id} `}
                                      </h6>
                                    )}
                                {editCampaignData?.discount_type != "product"
                                  ? (editCampaignData?.reward_4_tier ||
                                      editCampaignData?.reward_4_discount) &&
                                    !isReward4Filled &&
                                    reward?.id === 4 && (
                                      <h6 className="discount_error_text">
                                        <MdError
                                          style={{
                                            height: 16,
                                            width: 16,
                                            marginRight: 5,
                                          }}
                                        />
                                        {`Please Fill out all Fields for Tier ${reward?.id} `}
                                      </h6>
                                    )
                                  : (editCampaignData?.reward_4_tier ||
                                      editCampaignData?.reward_4_product) &&
                                    !isReward4ProductFilled &&
                                    reward?.id === 4 && (
                                      <h6 className="discount_error_text">
                                        <MdError
                                          style={{
                                            height: 16,
                                            width: 16,
                                            marginRight: 5,
                                          }}
                                        />
                                        {`Please Fill out all Fields for Tier ${reward?.id} `}
                                      </h6>
                                    )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="reward-section">
                    <>
                      <button
                        className="prevBtn"
                        onClick={() => handlePrevious(1)}
                      >
                        Previous
                      </button>
                      <button
                        className="nextBtn"
                        onClick={() => handleDiscountValidation(3)}
                        disabled={
                          newCampaignData?.discount_type == "product"
                            ? (newCampaignData?.reward_3_tier &&
                                !isReward3ProductFilled) ||
                              (newCampaignData?.reward_4_tier &&
                                !isReward4ProductFilled)
                            : (newCampaignData?.reward_3_tier &&
                                !isReward3Filled) ||
                              (newCampaignData?.reward_4_tier &&
                                !isReward4Filled)
                        }
                      >
                        Next
                      </button>
                    </>
                  </div>
                </>
              )}
            </section>

            {/* Email Settings */}
            <section className="newcampaign-settings">
              <div
                className={`emails-settings ${
                  expanded[3] ? "active-card" : "inactive-card"
                }`}
                // onClick={() => handleExpand(3)}
              >
                <div className="card-header">
                  <h2 className="card-title">Email Settings</h2>
                  <span
                    className="toggle-btn"
                    // onClick={() => handleExpand(3)}
                  >
                    {expanded[3] ? (
                      <IoIosArrowUp
                        style={{ strokeWidth: "70", fill: "#fff" }}
                        onClick={() => handleExpand(3)}
                      />
                    ) : (
                      <IoIosArrowDown
                        style={{ strokeWidth: "70", fill: "#fff" }}
                        // onClick={() => handleExpand(3)}
                      />
                    )}
                  </span>
                </div>
              </div>
              {expanded[3] && (
                <>
                  <div className="email-container">
                    {/* Hide the Double OPT in email Section */}
                    {/* <div className="email-optCheck">
                      {isEdit ? (
                        <input
                          className="checkbox-input"
                          type="checkbox"
                          name="double_opt_in"
                          id="double_opt_in"
                          checked={editCampaignData?.double_opt_in}
                          onChange={handleCheckboxChange}
                        />
                      ) : (
                        <input
                          className="checkbox-input"
                          type="checkbox"
                          name="double_opt_in"
                          id="double_opt_in"
                          checked={newCampaignData?.double_opt_in}
                          onChange={handleCheckboxChange}
                        />
                      )}
                      <label htmlFor="double_opt_in">
                        Enable Double Opt in for new sign-ups (This feature
                        requires Professional Plan or above)
                      </label>
                    </div>
                    <section>
                      <div className="email-section">
                        <h2>Email Settings - Double Opt-in Email </h2>
                        <div className="email-content">
                          <img
                            src={BlackLogo}
                            alt="Shop Logo"
                            className="shop-logo"
                          />

                          {isEdit ? (
                            <textarea
                              className="email-textinput"
                              type="text"
                              rows={9}
                              value={editCampaignData?.double_opt_in_email}
                              name="double_opt_in_email"
                              id="double_opt_in_email"
                              onChange={handleChange}
                            />
                          ) : (
                            <textarea
                              className="email-textinput"
                              type="text"
                              rows={9}
                              value={newCampaignData?.double_opt_in_email}
                              name="double_opt_in_email"
                              id="double_opt_in_email"
                              onChange={handleChange}
                            />
                          )}
                        </div>
                      </div>
                    </section> */}
                    <section>
                      <div className="email-section">
                        <h2>
                          Welcome Email Draft - This email is sent when a
                          customer signs up{" "}
                        </h2>
                        <div className="email-content">
                          <img
                            src={BlackLogo}
                            alt="Shop Logo"
                            className="shop-logo"
                          />

                          {isEdit ? (
                            <textarea
                              className="email-textinput"
                              rows={9}
                              value={editCampaignData?.welcome_email}
                              name="welcome_email"
                              id="welcome_email"
                              onChange={handleChange}
                            />
                          ) : (
                            <textarea
                              className="email-textinput"
                              rows={9}
                              value={newCampaignData?.welcome_email}
                              name="welcome_email"
                              id="welcome_email"
                              onChange={handleChange}
                            />
                          )}
                        </div>
                      </div>
                    </section>
                    <section>
                      <div className="email-section">
                        <h2>
                          Referral Email Draft - This email is sent when a
                          referral signs up{" "}
                        </h2>
                        <div className="email-content">
                          <img
                            src={BlackLogo}
                            alt="Shop Logo"
                            className="shop-logo"
                          />

                          {isEdit ? (
                            <textarea
                              className="email-textinput"
                              rows={9}
                              name="referral_email"
                              value={editCampaignData?.referral_email}
                              onChange={handleChange}
                            />
                          ) : (
                            <textarea
                              className="email-textinput"
                              rows={9}
                              name="referral_email"
                              value={newCampaignData?.referral_email}
                              onChange={handleChange}
                            />
                          )}
                        </div>
                      </div>
                    </section>
                    <section>
                      <div className="email-section">
                        <h2>
                          Reward Tier Email Draft - This email is sent when a
                          reward tier is unlocked
                        </h2>
                        <div className="email-content">
                          <img
                            src={BlackLogo}
                            alt="Shop Logo"
                            className="shop-logo"
                          />

                          {isEdit ? (
                            <textarea
                              className="email-textinput"
                              rows={9}
                              name="reward_email"
                              value={editCampaignData?.reward_email}
                              onChange={handleChange}
                            />
                          ) : (
                            <textarea
                              className="email-textinput"
                              rows={9}
                              name="reward_email"
                              value={newCampaignData?.reward_email}
                              onChange={handleChange}
                            />
                          )}
                        </div>
                      </div>
                    </section>
                  </div>
                  <div className="email-setting-section">
                    <>
                      <button
                        className="prevBtn"
                        onClick={() => handlePrevious(2)}
                      >
                        Previous
                      </button>
                      <button className="nextBtn" onClick={() => handleNext(4)}>
                        Next
                      </button>
                    </>
                  </div>
                </>
              )}
            </section>

            {/* Integration Settings */}

            <section className="newcampaign-settings">
              <div
                className={`integration-settings ${
                  expanded[4] ? "active-card" : "inactive-card"
                }`}
              >
                <div className="card-header">
                  <h2 className="card-title">Integration Settings</h2>
                  <span className="toggle-btn">
                    {expanded[4] ? (
                      <IoIosArrowUp
                        style={{ strokeWidth: "70", fill: "#fff" }}
                        onClick={() => handleExpand(4)}
                      />
                    ) : (
                      <IoIosArrowDown
                        style={{ strokeWidth: "70", fill: "#fff" }}
                      />
                    )}
                  </span>
                </div>
              </div>

              {expanded[4] && (
                <>
                  <div className="integration-container">
                    {myPlan === "Free" ? (
                      <h2
                        style={{
                          fontSize: 21,
                          textDecoration: "underline",
                          margin: 20,
                          padding: 20,
                        }}
                      >
                        Klaviyo Integration is not available for Free Plan{" "}
                      </h2>
                    ) : (
                      <div className="integration-block-content">
                        <div className="check-input">
                          {isEdit ? (
                            <input
                              type="checkbox"
                              name="klaviyo_integration"
                              checked={editCampaignData?.klaviyo_integration}
                              // onChange={handleCheckboxChange}
                              readOnly
                            />
                          ) : (
                            <input
                              type="checkbox"
                              name="klaviyo_integration"
                              checked={newCampaignData?.klaviyo_integration}
                              readOnly
                              disabled={
                                globalSettings?.klaviyo_integration || true
                              }
                              onChange={handleCheckboxChange}
                            />
                          )}
                          <label htmlFor="klaviyo_integration">
                            Integrate with Klaviyo
                          </label>
                        </div>

                        <div className="integration-settings-container">
                          <div className="form-group">
                            <div className="inputfield">
                              <label htmlFor="klaviyo_api_key">
                                Private API Key
                              </label>
                              {isEdit ? (
                                <input
                                  type="text"
                                  className="disabled-value"
                                  name="klaviyo_api_key"
                                  id="klaviyo_api_key"
                                  placeholder="Enter API Key"
                                  value={globalSettings?.klaviyo_api_key}
                                  onChange={handleChange}
                                  readOnly
                                />
                              ) : (
                                <input
                                  className="disabled-value"
                                  type="text"
                                  name="klaviyo_api_key"
                                  id="klaviyo_api_key"
                                  placeholder="Enter API Key"
                                  value={newCampaignData?.klaviyo_api_key}
                                  onChange={handleChange}
                                  readOnly
                                />
                              )}
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="inputfield">
                              {klaviyoList?.length > 2 && (
                                <label htmlFor="">List to Add Users</label>
                              )}

                              {klaviyoList?.length > 2 ? (
                                <div className="select-user-input">
                                  {isEdit ? (
                                    <select
                                      name="klaviyo_list_id"
                                      id="klaviyo_list_id"
                                      value={editCampaignData?.klaviyo_list_id}
                                      onChange={handleChange}
                                    >
                                      <option value="Select">Select</option>
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
                                      name="klaviyo_list_id"
                                      id="klaviyo_list_id"
                                      value={newCampaignData?.klaviyo_list_id}
                                      onChange={handleChange}
                                    >
                                      <option value="Select">Select</option>
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
                                <Link to="/settings">
                                  {!isEdit && (
                                    <p className="klaviyo-message">
                                      Please Enable API Key in Global Settings
                                    </p>
                                  )}
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="integrate-setting-btn">
                    <>
                      <button
                        className="prevBtn"
                        onClick={() => handlePrevious(3)}
                      >
                        Previous
                      </button>
                      <button className="nextBtn" onClick={() => NextClick(5)}>
                        Next
                      </button>
                    </>
                  </div>
                </>
              )}
            </section>

            {/* Template Settings */}

            <section className="newcampaign-settings">
              <div
                className={`template-settings ${
                  expanded[5] ? "active-card" : "inactive-card"
                }`}
              >
                <div className="card-header">
                  <h2 className="card-title">Template Settings</h2>
                  <span className="toggle-btn">
                    {expanded[5] ? (
                      <IoIosArrowUp
                        style={{ strokeWidth: "70", fill: "#fff" }}
                        onClick={() => handleExpand(5)}
                      />
                    ) : (
                      <IoIosArrowDown
                        style={{ strokeWidth: "70", fill: "#fff" }}
                      />
                    )}
                  </span>
                </div>
              </div>

              {expanded[5] && (
                <>
                  <div className="template-container">
                    <div className="template-content">
                      <p>
                        Select one of the following specially curated template
                      </p>
                    </div>
                    <div className="templates-block-container">
                      <div className="template-cards">
                        {randomTemplate?.map((template, index) => (
                          <>
                            {isEdit ? (
                              <div
                                key={template?.id}
                                className={
                                  selectedTemplateData?.id === template?.id
                                    ? "template-card-block selected"
                                    : "template-card-block"
                                }
                                onClick={
                                  isEdit && editCampaignData?.is_draft
                                    ? () => handleTemplateSelect(template)
                                    : undefined
                                }
                                disabled={isEdit && !editCampaignData?.is_draft}
                              >
                                {template?.id === 1 ? (
                                  <h3>
                                    Build a custom template in the Shopify Theme
                                    Editor{" "}
                                  </h3>
                                ) : (
                                  template?.id > 1 && (
                                    <img
                                      key={template?.id}
                                      src={template?.landing_welcome_image_url}
                                      alt={template?.campaign_name}
                                    />
                                  )
                                )}
                              </div>
                            ) : (
                              <div
                                key={template?.id}
                                className={
                                  selectedTemplateData?.id === template?.id
                                    ? "template-card-block selected"
                                    : "template-card-block"
                                }
                                onClick={() => handleTemplateSelect(template)}
                              >
                                {template?.id === 1 ? (
                                  <h3>
                                    Build a custom template in the Shopify Theme
                                    Editor{" "}
                                  </h3>
                                ) : (
                                  template?.id > 1 && (
                                    <img
                                      key={template?.id}
                                      src={template?.landing_welcome_image_url}
                                      alt={template?.campaign_name}
                                    />
                                  )
                                )}
                              </div>
                            )}
                          </>
                        ))}
                      </div>
                    </div>

                    <div className="laststep">
                      <p>
                        After the Campaign is created Successfully, you will be
                        navigated to Campaigns Table Where You can Edit or
                        Finalize Your Campaigns Settings.
                      </p>
                    </div>
                  </div>
                  <div className="template-end">
                    <>
                      <button
                        className="prevBtn"
                        onClick={() => handlePrevious(4)}
                      >
                        Previous
                      </button>
                      <button
                        className="saveFormBtn"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isEdit ? (
                          editCampaignData?.is_draft ? (
                            <>{isLoading ? "Save" : "Save Campaign"}</>
                          ) : (
                            <>{isLoading ? "Updating..." : "Update Campaign"}</>
                          )
                        ) : (
                          <>{isLoading ? "Saving..." : "Create Campaign"}</>
                        )}
                      </button>
                    </>
                  </div>
                </>
              )}
            </section>
          </form>

          {/* Loading Animation  */}
          <div id="loading-overlay">
            <div id="loading-spinner">
              <h2>Setting Up the best templates for your campaigns</h2>
              <img src={anime} alt="image" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NewCampaignForm;
