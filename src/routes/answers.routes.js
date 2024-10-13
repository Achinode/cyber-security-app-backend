const express = require("express");
const answerRouter = express.Router();
const answerController = require("../controllers/answers.controller");
const authenticateUserJWT = require("../middlewares/user.middleware");
const authenticateAdminJWT = require("../middlewares/admin.middleware");

answerRouter.post("/add", authenticateUserJWT, answerController.createAnswers);
answerRouter.post(
    "/update/:answersId",
    authenticateAdminJWT,
    answerController.updateAnswers
);
answerRouter.get("/", authenticateAdminJWT, answerController.getAllAnswers);
answerRouter.get(
    "/student/",
    authenticateUserJWT,
    answerController.getAllAnswersByStudent
);
answerRouter.get(
    "/:answersId",
    authenticateAdminJWT,
    answerController.getAnswersById
);
answerRouter.delete(
    "/:answersId",
    authenticateAdminJWT,
    answerController.deleteAnswers
);
answerRouter.post(
    "/finish/:quizID",
    authenticateUserJWT,
    answerController.finishAnswer
);
module.exports = answerRouter;
