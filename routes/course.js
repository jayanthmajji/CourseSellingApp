const { Router } = require("express");
const { userMiddleware } = require("../middleware/user");
const { purchaseModel, courseModel } = require("../model/db");
const courseRouter = Router();

// purchase the course

courseRouter.post("/purchase", userMiddleware, async function (req, res) {
  const userId = req.userId;

  const courseId = req.body.courseId;

  // check for the existence of course
  if (!courseId) {
    res.json({
      message: "Provide a courseId!",
    });
  }
  // check for the course purchased
  const existingPurchase = await purchaseModel.findOne({
    courseId: courseId,
    userId: userId,
  });

  if (existingPurchase) {
    res.json({
      message: "You have already purchased the course!",
    });
  }

  await purchaseModel.create({
    courseId: courseId,
    userId: userId,
  });
  res.json({
    message: "You have bought the course!",
  });
});

// to preview the courses

courseRouter.get("/preview", async function (req, res) {
  const courses = await courseModel.find({});
  res.json({
    courses: courses,
  });
});

module.exports = {
  courseRouter: courseRouter,
};
