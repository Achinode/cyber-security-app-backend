const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user.controller");
const authenticateAdminJWT = require("../middlewares/admin.middleware");
const authenticateUserJWT = require("../middlewares/user.middleware");

userRouter.post("/signup", userController.signUp);
userRouter.post("/signin", userController.signIn);
userRouter.get("/", authenticateAdminJWT, userController.getAllUsers);
userRouter.get("/single", authenticateUserJWT, userController.getOneUser);
userRouter.post("/single", authenticateUserJWT, userController.updateOneUser);
userRouter.post("/activate-email/:userId", userController.activateEmail);
userRouter.post("/validate-otp", userController.validateOTP);
userRouter.post(
    "/password-change",
    authenticateUserJWT,
    userController.userChangePassword
);
userRouter.post(
    "/deactivate/:userId",
    authenticateAdminJWT,
    userController.userAccountActivation
);
userRouter.delete(
    "/delete/:userId",
    authenticateAdminJWT,
    userController.delete
);

module.exports = userRouter;
