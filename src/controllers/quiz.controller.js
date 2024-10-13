const Quiz = require("../models/quiz.model");

// Create a new quiz
exports.createQuiz = async (req, res) => {
    const { quizName, questionList } = req.body;
    try {
        const quiz = new Quiz({
            quizName,
            questionList,
        });
        await quiz.save();
        res.status(201).json({
            status: "OK",
            message: "Quiz created successfully",
            data: quiz,
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Error creating quiz",
            data: error,
        });
    }
};

// Get all quizzes
exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find(
            { isDeleted: false },
            { questionList: 0 }
        );
        res.status(200).json({ status: "OK", data: quizzes });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Error fetching quizzes",
            error,
        });
    }
};

// Get a quiz by ID
exports.getQuizById = async (req, res) => {
    const { quizId } = req.params;
    try {
        const quiz = await Quiz.findById(quizId);
        if (!quiz)
            return res
                .status(404)
                .json({ status: "ERROR", message: "Quiz not found" });
        res.status(200).json({ status: "OK", data: quiz });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Error fetching quiz",
            data: error,
        });
    }
};

// Update a quiz
exports.updateQuiz = async (req, res) => {
    const { quizId } = req.params;
    const { quizName, questionList, isActive } = req.body;

    try {
        const quiz = await Quiz.findByIdAndUpdate(
            quizId,
            { quizName, questionList, isActive },
            { new: true }
        );
        if (!quiz)
            return res
                .status(404)
                .json({ status: "ERROR", message: "Quiz not found" });
        res.status(200).json({
            status: "OK",
            message: "Quiz updated successfully",
            data: quiz,
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Error updating quiz",
            error,
        });
    }
};

// Delete a quiz (soft delete)
exports.deleteQuiz = async (req, res) => {
    const { quizId } = req.params;
    try {
        const quiz = await Quiz.findByIdAndUpdate(quizId, { isDeleted: true });
        if (!quiz)
            return res
                .status(404)
                .json({ status: "ERROR", message: "Quiz not found" });
        res.status(200).json({
            status: "OK",
            message: "Quiz deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Error deleting quiz",
            data: error,
        });
    }
};
