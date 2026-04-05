import { Router } from "express";
import {
  getCurrentUser,
  getUserById,
  loginUser,
  logoutUser,
  refreshUserToken,
  signupUser,
  updateUserById,
  updateUserPasswordById,
} from "../controllers/users.js";
import { isAuth } from "../middleware/isAuth.js";

const userRouter = Router();

userRouter.post("/signup", signupUser);
userRouter.post("/login", loginUser);
userRouter.post("/refreshToken", refreshUserToken);
userRouter.post("/logout", logoutUser);
userRouter.get("/me", isAuth, getCurrentUser);
userRouter.get("/user/:id", isAuth, getUserById);
userRouter.put("/user/:id", isAuth, updateUserById);
userRouter.put("/user/:id/password", isAuth, updateUserPasswordById);

export default userRouter;
