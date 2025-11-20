const { systemSummaryRouter } = require("./systemSummaryRouter");
const { transactionRouter } = require("./transactionRouter");
const { userRouter } = require("./UserRouter");

const indexRouter = require("express").Router();

indexRouter.use("/user",userRouter);
indexRouter.use("/summary",systemSummaryRouter)
indexRouter.use("/transactions",transactionRouter)


exports.indexRouter = indexRouter;