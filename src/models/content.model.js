const mongoose = require("mongoose");
const { Schema } = mongoose;

const contentSchema = new Schema(
    {
        orderNo: { type: Number, required: true },
        subjectName: { type: String, required: true },
        mdContent: { type: String, required: true }, // Markdown content
        quizID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
            required: true,
        },
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Content = mongoose.model("Content", contentSchema);
module.exports = Content;
