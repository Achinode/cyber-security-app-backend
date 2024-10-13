const Answers = require("../models/answers.model");
const Users = require("../models/user.model");
const Quiz = require("../models/quiz.model");

// Create an answer entry (for quiz submission)
exports.createAnswers = async (req, res) => {
    const userID = req.user.userId;
    const { quizID, answersList, attempts, marks, isFinished } = req.body;
    try {
        const _answers = await Answers.findOne({ userID, quizID });

        if (!_answers) {
            const answers = new Answers({
                userID,
                quizID,
                answersList,
                attempts,
                marks,
                isFinished,
            });
            await answers.save();

            const userAnswers = await Answers.find({ userID }, { marks: 1 });

            const overallMarks = userAnswers.reduce(
                (sum, current) => sum + current.marks,
                0
            );

            await Users.findByIdAndUpdate(userID, {
                overallMarks: overallMarks / userAnswers.length,
            });

            return res.status(201).json({
                status: "OK",
                message: "Answers submitted successfully!",
                answers,
            });
        } else {
            if (_answers.isFinished) {
                return res.status(400).json({
                    status: "ERROR",
                    message: "You Already finished this quiz!",
                });
            }

            _answers.answersList = answersList || _answers.answersList;
            _answers.marks = marks || _answers.marks;
            _answers.isFinished = isFinished || _answers.isFinished;
            _answers.attempts += 1;

            await _answers.save();

            const userAnswers = await Answers.find({ userID }, { marks: 1 });

            const overallMarks = userAnswers.reduce(
                (sum, current) => sum + current.marks,
                0
            );

            await Users.findByIdAndUpdate(userID, {
                overallMarks: overallMarks / userAnswers.length,
            });
            return res.status(201).json({
                status: "OK",
                message: "Answers updated successfully!",
                data: _answers,
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "ERROR",
            message: "Error submitting answers",
            data: error,
        });
    }
};

// Get all answers
exports.getAllAnswers = async (req, res) => {
    try {
        const answers = await Answers.find({ isDeleted: false });
        res.status(200).json({ status: "OK", data: answers });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Error fetching answers",
            data: error,
        });
    }
};
// Get all answers
exports.getAllAnswersByStudent = async (req, res) => {
    const userID = req.user.userId;

    try {
        const answers = await Answers.find(
            { isDeleted: false, userID },
            { answersList: 0 }
        ).populate("quizID", { quizName: 1 });
        res.status(200).json({ status: "OK", data: answers });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Error fetching answers",
            data: error,
        });
    }
};

// Get answers by ID
exports.getAnswersById = async (req, res) => {
    const { answersId } = req.params;
    try {
        const answers = await Answers.findById(answersId);
        if (!answers)
            return res
                .status(404)
                .json({ status: "ERROR", message: "Answers not found" });
        res.status(200).json({ status: "OK", data: answers });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Error fetching answers",
            data: error,
        });
    }
};

// Update answers (for retries)
exports.updateAnswers = async (req, res) => {
    const { answersId } = req.params;
    const { answersList, marks, isFinished } = req.body;

    try {
        const answers = await Answers.findById(answersId);

        if (!answers)
            return res
                .status(404)
                .json({ status: "ERROR", message: "Answers not found" });

        answers.answersList = answersList || answers.answersList;
        answers.marks = marks || answers.marks;
        answers.isFinished = isFinished || answers.isFinished;
        answers.attempts += 1;

        await answers.save();
        res.status(200).json({
            status: "OK",
            message: "Answers updated successfully",
            data: answers,
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Error updating answers",
            data: error,
        });
    }
};

// Delete answers (soft delete)
exports.deleteAnswers = async (req, res) => {
    const { answersId } = req.params;
    try {
        const answers = await Answers.findByIdAndUpdate(answersId, {
            isDeleted: true,
        });
        if (!answers)
            return res
                .status(404)
                .json({ status: "ERROR", message: "Answers not found" });
        res.status(200).json({
            status: "OK",
            message: "Answers deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Error deleting answers",
            data: error,
        });
    }
};
// Delete answers (soft delete)
exports.finishAnswer = async (req, res) => {
    const userID = req.user.userId;

    const { quizID } = req.params;
    try {
        const answers = await Answers.findOneAndUpdate(
            { quizID, userID },
            {
                isFinished: true,
            }
        );
        if (!answers)
            return res
                .status(404)
                .json({ status: "ERROR", message: "Answers not found" });

        const userAnswers = await Answers.find({ userID }, { marks: 1 });
        const allQuestions = await Quiz.find({}, { quizName: 1 });

        await Users.findByIdAndUpdate(userID, {
            progress: Math.round(
                100 * (userAnswers.length / allQuestions.length)
            ),
        });
        res.status(200).json({
            status: "OK",
            message:
                "You successfully finished answering. No more attempt for the quiz",
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Error deleting answers",
            data: error,
        });
    }
};
