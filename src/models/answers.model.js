const mongoose = require("mongoose");
const { Schema } = mongoose;

const answersSchema = new Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        quizID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
            required: true,
        },
        answersList: [
            {
                questionID: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                },
                answer: { type: Number, required: true },
            },
        ],
        attempts: { type: Number, default: 1 },
        marks: { type: Number, default: 0 },
        isFinished: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Answers = mongoose.model("Answers", answersSchema);
module.exports = Answers;
