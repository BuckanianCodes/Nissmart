const { transferFunds } = require("../controllers/transferController");
const { transferRouter } = require("./transferRouter");
const { userRouter } = require("./UserRouter");
const { withdrawRouter } = require("./withdrawalRouter");

const indexRouter = require("express").Router();

indexRouter.use("/user",userRouter);
withdrawRouter.use("/account",withdrawRouter);
transferRouter.use("/funds",transferFunds)


exports.indexRouter = indexRouter;