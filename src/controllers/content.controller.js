const Answers = require("../models/answers.model");
const Content = require("../models/content.model");

// Create new content
exports.createContent = async (req, res) => {
    const { orderNo, subjectName, mdContent, quizID } = req.body;
    try {
        const content = new Content({
            orderNo,
            subjectName,
            mdContent,
            quizID,
        });
        await content.save();
        res.status(201).json({
            status: "OK",
            message: "Content created successfully",
            data: content,
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Error creating content",
            error,
        });
    }
};

// Get all content
exports.getAllContent = async (req, res) => {
    try {
        const contents = await Content.find(
            { isDeleted: false, isActive: true },
            { mdContent: 0 }
        );
        res.status(200).json({ status: "OK", data: contents });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Error fetching content",
            error,
        });
    }
};
// Get all content
exports.getAllContentStudent = async (req, res) => {
    try {
        const contents = await Content.find(
            { isDeleted: false, isActive: true },
            { mdContent: 0 }
        );
        res.status(200).json({ status: "OK", data: contents });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "ERROR",
            message: "Error fetching content",
            error,
        });
    }
};

// Get all content
exports.getAllContentByAdmin = async (req, res) => {
    try {
        const contents = await Content.find(
            { isDeleted: false },
            { mdContent: 0 }
        );
        res.status(200).json({ status: "OK", data: contents });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Error fetching content",
            error,
        });
    }
};

// Get content by ID
exports.getContentById = async (req, res) => {
    const { contentId } = req.params;
    try {
        const content = await Content.findById(contentId);
        if (!content)
            return res
                .status(404)
                .json({ status: "ERROR", message: "Content not found" });
        res.status(200).json({ status: "OK", data: content });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Error fetching content",
            error,
        });
    }
};

// Update content
exports.updateContent = async (req, res) => {
    const { contentId } = req.params;
    const { orderNo, subjectName, mdContent, quizID, isActive } = req.body;

    try {
        const content = await Content.findByIdAndUpdate(
            contentId,
            { orderNo, subjectName, mdContent, quizID, isActive },
            { new: true }
        );
        if (!content)
            return res
                .status(404)
                .json({ status: "ERROR", message: "Content not found" });
        res.status(200).json({
            status: "OK",
            message: "Content updated successfully",
            data: content,
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Error updating content",
            error,
        });
    }
};

// Delete content (soft delete)
exports.deleteContent = async (req, res) => {
    const { contentId } = req.params;
    try {
        const content = await Content.findByIdAndUpdate(contentId, {
            isDeleted: true,
        });
        if (!content)
            return res
                .status(404)
                .json({ status: "ERROR", message: "Content not found" });
        res.status(200).json({
            status: "OK",
            message: "Content deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Error deleting content",
            error,
        });
    }
};
