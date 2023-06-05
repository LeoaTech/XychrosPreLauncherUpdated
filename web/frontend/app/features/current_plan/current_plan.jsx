import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  current_plan: {
    id: 1,
    plan_name: "Free",
    price: "0.00",
    features:
      { feature1: '1 Active Campaign Created', feature2: '50 Emails Collected', feature3: 'Anti Fraud' },
    billing_required: false,
    currency_code: "USD"
  },
};

export const currentPlanSlice = createSlice({
  name: "current_plan",
  initialState: initialState,
  reducers: {
    fetchSavePlan: (state, action) => {
      state.current_plan = action.payload;
      console.log(current(state), "Current")

    },

  },
});


export const fetchCurrentPlan = (state) => state.current_plan.current_plan;

export const { fetchSavePlan } = currentPlanSlice.actions;
export default currentPlanSlice.reducer;
