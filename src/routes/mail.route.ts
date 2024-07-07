import express from "express";
const router = express.Router();
import { sendMail } from "../controllers/mail.controller";

router.post("/sendMail", sendMail);

export default router;
