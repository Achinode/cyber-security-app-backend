const express = require("express");
const quizRouter = express.Router();
const quizController = require("../controllers/quiz.controller");
const authenticateAdminJWT = require("../middlewares/admin.middleware");
const authenticateUserJWT = require("../middlewares/user.middleware");

quizRouter.post("/add", authenticateAdminJWT, quizController.createQuiz);
quizRouter.post(
    "/update/:quizId",
    authenticateAdminJWT,
    quizController.updateQuiz
);
quizRouter.get("/", authenticateAdminJWT, quizController.getAllQuizzes);
quizRouter.get("/:quizId", authenticateUserJWT, quizController.getQuizById);
quizRouter.delete("/:quizId", authenticateAdminJWT, quizController.deleteQuiz);
module.exports = quizRouter;
