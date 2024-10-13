const { Router } = require("express");
const testRouter = require("./test.routes");
const userRouter = require("./user.routes");
const adminRouter = require("./admin.routes");
const contentRouter = require("./content.routes");
const quizRouter = require("./quiz.routes");
const answerRouter = require("./answers.routes");

const router = Router();

router.use("/test", testRouter);
router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/content", contentRouter);
router.use("/quiz", quizRouter);
router.use("/answer", answerRouter);

module.exports = { router };
