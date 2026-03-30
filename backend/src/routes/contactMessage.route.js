import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  submitContactMessage,
  getAllContactMessages,
  deleteContactMessage,
} from "../controllers/contactMessage.controller.js";

const router = Router();

// Public route — visitors can submit without logging in
router.route("/submit").post(submitContactMessage);

// Admin-only routes
router.route("/all").get(verifyJWT, getAllContactMessages);
router.route("/delete/:messageId").delete(verifyJWT, deleteContactMessage);

export default router;
