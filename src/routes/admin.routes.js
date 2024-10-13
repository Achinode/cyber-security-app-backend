const express = require("express");
const adminRouter = express.Router();
const userController = require("../controllers/admin.controller");
const authenticateAdminJWT = require("../middlewares/admin.middleware");

adminRouter.post("/signup", authenticateAdminJWT, userController.signUp);
adminRouter.post("/signin", userController.signIn);
adminRouter.get("/", authenticateAdminJWT, userController.getAllAdmins);
adminRouter.delete(
    "/:adminId",
    authenticateAdminJWT,
    userController.deleteAdmin
);

adminRouter.put(
    "/deactivate/:userId",
    authenticateAdminJWT,
    userController.deactivate
);

module.exports = adminRouter;
