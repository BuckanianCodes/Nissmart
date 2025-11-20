const { systemSummary, recentActivities } = require("../controllers/systemController");

const systemSummaryRouter = require("express").Router();

systemSummaryRouter.route("/get").get(systemSummary);
systemSummaryRouter.route("/logs").get(recentActivities)

exports.systemSummaryRouter = systemSummaryRouter;