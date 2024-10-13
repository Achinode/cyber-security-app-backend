const testMainRoute = (req, res) => {
    res.json({ status: "OK", data: "Main Route Working Normally" });
};

module.exports = { testMainRoute };
