import express from "express";
const router = express.Router();

import * as authcontroller from "../controllers/auth.controller.js";

router.route("/register")
	.get(authcontroller.getRegisterpage)
	.post(authcontroller.postRegisterpage);

router.route("/login")
	.get(authcontroller.getLoginpage)
	.post(authcontroller.postLoginpage);

router.route("/logout").get(authcontroller.getLogout);

router.route("/me").get(authcontroller.getMePage);
export const authRouter = router;
