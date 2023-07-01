import { Router } from "express";
import {
  getProfile,
  login,
  logout,
  signUp,
} from "../controllers/auth.controller";
import isLoggedIn from "../middleware/authMiddleware.js";

const router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/loout", logout);
router.get("/getProfile", isLoggedIn, getProfile);

export default router;
