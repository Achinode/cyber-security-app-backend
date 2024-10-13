const { Router } = require("express");
const { testMainRoute } = require("../controllers/test.controller");

const testRouter = Router();

testRouter.get("/main", testMainRoute);

module.exports = testRouter;
