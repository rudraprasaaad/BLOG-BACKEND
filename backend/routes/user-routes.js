import express from "express";
import getAllUser, { login, signUp } from "../contorller/user.controller.js";
const router = express.Router();

router.get("/", getAllUser);
router.post("/signup", signUp);
router.post("/login", login);

export default router;
