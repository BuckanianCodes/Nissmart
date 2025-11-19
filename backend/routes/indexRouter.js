const { userRouter } = require("./UserRouter");

const indexRouter = require("express").Router();

indexRouter.use("/user",userRouter);

exports.indexRouter = indexRouter;