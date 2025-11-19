const { withdrawFromAccount } = require("../controllers/withdrawController");

const withdrawRouter = require("express").Router();

withdrawRouter.route("/withdraw").post(withdrawFromAccount);

exports.withdrawRouter = withdrawRouter