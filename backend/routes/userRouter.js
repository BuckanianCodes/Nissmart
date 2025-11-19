const { createUser, getUsers, viewUserBalance, getUserTransactions } = require("../controllers/userController");

const userRouter = require("express").Router();

userRouter.route("/create").post(createUser);
userRouter.route("/get").get(getUsers)
userRouter.route("/balance/:user_id").get(viewUserBalance);
userRouter.route("/transactions/:user_id").get(getUserTransactions);

exports.userRouter = userRouter;