const { Router } = require("express");
const { userModel, purchaseModel, courseModel } = require("../model/db");
const { userMiddleware } = require("../middleware/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const { model } = require("mongoose");
const { JWT_USER } = require("../config");
const userRouter = Router();

// signup end point

userRouter.post("/signup", async function (req, res) {
  // input validation
  const requireBody = z.object({
    email: z.string().min(3).max(100).email(),
    password: z
      .string()
      .min(5)
      .max(100)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      ),
    firstname: z.string().min(3).max(100),
    lastname: z.string().min(3).max(100),
  });
  // parsing the data in the body
  const parseDatawithSuccess = requireBody.safeParse(req.body);

  if (!parseDatawithSuccess.success) {
    res.json({
      message: "Incorrect format!",
      error: parseDatawithSuccess.error,
    });
    return;
  }

  const { email, password, firstname, lastname } = req.body;
  // password hashing

  let thrownError = false;
  try {
    const hashedPassword = await bcrypt.hash(password, 5);
    console.log(hashedPassword);

    await userModel.create({
      email: email,
      password: hashedPassword,
      firstname: firstname,
      lastname: lastname,
    });
  } catch (e) {
    res.json({
      message: "User already exits!",
    });
    thrownError = true;
  }
  if (!thrownError) {
    res.json({
      message: "user has signed up!",
    });
  }
});
// signin end point

userRouter.post("/signin", async function (req, res) {
  try {
    const { email, password } = req.body;

    const response = await userModel.findOne({ email: email });

    if (!response) {
      return res.status(400).json({
        message: "User not found!",
      });
    }

    const passwordMatch = await bcrypt.compare(password, response.password);

    if (passwordMatch) {
      const token = jwt.sign(
        {
          id: response._id.toString(),
        },
        JWT_USER
      );
      res.json({
        Token: token,
        message: "User has signed in!",
      });
    } else {
      res.status(400).json({
        message: "Invalid credentials!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Signin failed",
      error: error.message,
    });
  }
});

// getting the purchases made by the user

userRouter.get("/purchases", userMiddleware, async function (req, res) {
  const userId = req.userId;

  const purchases = await purchaseModel.find({
    userId,
  });

  let purchasedCourseIds = [];

  for (let i = 0; i < purchases.length; i++) {
    purchasedCourseIds.push(purchases[i].courseId);
  }

  const coursesData = await courseModel.find({
    _id: "66fac0c55af7d7d0f0f7f189",
  });

  res.json({
    purchases,
    coursesData,
  });
});

module.exports = {
  userRouter: userRouter,
};
