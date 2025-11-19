const { transferFunds,withdrawFromAccount, depositFunds } = require("../controllers/transactionController");


const transactionRouter = require("express").Router();

transactionRouter.route("/transfer").post(transferFunds);
transactionRouter.route("/withdraw").post(withdrawFromAccount);
transactionRouter.route("/deposit").post(depositFunds);

exports.transactionRouter = transactionRouter

