const express = require("express");
const contentRouter = express.Router();
const contentController = require("../controllers/content.controller");
const authenticateAdminJWT = require("../middlewares/admin.middleware");
const authenticateUserJWT = require("../middlewares/user.middleware");

contentRouter.post(
    "/add",
    authenticateAdminJWT,
    contentController.createContent
);
contentRouter.post(
    "/update/:contentId",
    authenticateAdminJWT,
    contentController.updateContent
);
contentRouter.get("/", contentController.getAllContent);
contentRouter.get(
    "/student/",
    authenticateUserJWT,
    contentController.getAllContentStudent
);
contentRouter.get(
    "/admin/",
    authenticateAdminJWT,
    contentController.getAllContentByAdmin
);
contentRouter.get("/:contentId", contentController.getContentById);
contentRouter.delete(
    "/:contentId",
    authenticateAdminJWT,
    contentController.deleteContent
);
module.exports = contentRouter;
