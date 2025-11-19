const { transferFunds } = require("../controllers/transferController");

const transferRouter = require("express").Router();

transferRouter.route("/transfer").post(transferFunds);

exports.transferRouter = transferRouter

