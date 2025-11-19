const { transactionRouter } = require("./transactionRouter");
const { userRouter } = require("./UserRouter");

const indexRouter = require("express").Router();

indexRouter.use("/user",userRouter);
transactionRouter.use("/transactions",transactionRouter)


exports.indexRouter = indexRouter;