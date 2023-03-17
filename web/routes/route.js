import express from "express";
import {
  check_email,
  get_user_referral_code,
  get_referrals,
  get_store_referrals,
} from "../controllers/controller.js";
export const router = express.Router();
router.post("/check_email", check_email);
router.post("/get_code", get_user_referral_code);
router.post("/get_referrals", get_referrals);
router.get("/get_store_referrals", get_store_referrals);
