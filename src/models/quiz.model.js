const mongoose = require("mongoose");
const { Schema } = mongoose;
const quizSchema = new Schema(
    {
        quizName: { type: String, required: true },
        questionList: [
            {
                orderNo: { type: Number, required: true },
                question: { type: String, required: true },
                answers: [
                    {
                        answerID: {
                            type: Number,
                            required: true,
                            unique: true,
                        },
                        answer: { type: String, required: true },
                    },
                ],
                correctAnswer: { type: Number, required: true },
            },
        ],
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
