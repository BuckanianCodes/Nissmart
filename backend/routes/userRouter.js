const { createUser } = require("../controllers/userController");

const userRouter = require("express").Router();

userRouter.route("/create").post(createUser);

exports.userRouter = userRouter;