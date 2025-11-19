const { createUser, getUsers } = require("../controllers/userController");

const userRouter = require("express").Router();

userRouter.route("/create").post(createUser);
userRouter.route("/get").get(getUsers)

exports.userRouter = userRouter;