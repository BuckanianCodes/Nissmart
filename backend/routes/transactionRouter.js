const { transferFunds,withdrawFromAccount, depositFunds, transactions } = require("../controllers/transactionController");


const transactionRouter = require("express").Router();

transactionRouter.route("/transfer").post(transferFunds);
transactionRouter.route("/withdraw").post(withdrawFromAccount);
transactionRouter.route("/deposit").post(depositFunds);
transactionRouter.route("/get").get(transactions)

exports.transactionRouter = transactionRouter

