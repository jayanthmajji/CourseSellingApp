const { Router } = require("express");
const jwt = require("jsonwebtoken");
const { z, object, number } = require("zod");
const bcrypt = require("bcrypt");
const { adminModel, userModel, courseModel } = require("../model/db");
const { JWT_ADMIN } = require("../config");
const { adminMiddleware } = require("../middleware/admin");
const adminRouter = Router();

// signup endpoint
adminRouter.post("/signup", async function (req, res) {
  // input validity

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
  // parsing the data
  const parsingDataWithSuccess = requireBody.safeParse(req.body);

  if (!parsingDataWithSuccess.success) {
    res.json({
      message: "Incorrect format!",
      error: parsingDataWithSuccess.error,
    });
    return;
  }
  const { email, password, firstname, lastname } = req.body;

  // password hashing

  let errorThrown = false;
  try {
    const hashedPassword = await bcrypt.hash(password, 5);
    console.log(hashedPassword);

    await adminModel.create({
      email: email,
      password: hashedPassword,
      firstname: firstname,
      lastname: lastname,
    });
  } catch (e) {
    res.json({
      message: "Admin already exits!",
    });
    errorThrown = true;
  }
  if (!errorThrown) {
    res.json({
      message: "Admin has signed up!",
    });
  }
});

// singin endpoint
adminRouter.post("/signin", async function (req, res) {
  try {
    const { email, password } = req.body;

    // find the admin with the email.
    const response = await adminModel.findOne({ email: email });

    if (!response) {
      res.json({
        message: "Admin not found!",
      });
    }

    // matching the password.
    const matchPassword = bcrypt.compare(password, response.password);

    if (matchPassword) {
      const token = jwt.sign(
        {
          id: response._id.toString(),
        },
        JWT_ADMIN
      );
      res.json({
        message: "Admin signed in!",
        Token: token,
      });
    } else {
      res.status(403).json({
        message: "Invalid credentials!",
      });
    }
  } catch (error) {
    res.json({
      message: "Sign in failed!",
      error: error.message,
    });
  }
});

// create a course

adminRouter.post("/course", adminMiddleware, async function (req, res) {
  const adminId = req.adminId;
  // input validation

  const requireBody = z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(5).max(100),
    imageUrl: z.string().url(),
    price: z.number().positive(),
  });
  // parsing the data
  const parsingDataWithSuccess = requireBody.safeParse(req.body);

  if (!parsingDataWithSuccess.success) {
    res.json({
      message: "Incorrect format!",
    });
  }
  const { title, description, imageUrl, price } = req.body;

  try {
    const course = await courseModel.create({
      title: title,
      description: description,
      imageUrl: imageUrl,
      price: price,
      creatorId: adminId,
    });
    res.json({
      message: "Course created!",
      courseId: course._id,
    });
  } catch (error) {
    res.json({
      message: "error in creating the course",
      error: error,
    });
  }
});

// update the course

adminRouter.post("/update", adminMiddleware, async function (req, res) {
  const adminId = req.adminId;

  // input validation

  const requireBody = z.object({
    title: z.string().min(5).max(100).optional(),
    description: z.string().min(5).max(100).optional(),
    imageUrl: z.string().url().optional(),
    price: z.number().positive().optional(),
  });

  // parsing the data
  const parsingDataWithSuccess = requireBody.safeParse(req.body);

  if (!parsingDataWithSuccess.success) {
    res.json({
      message: "Incorrect format!",
    });
  }

  const { title, description, imageUrl, price, courseId } = req.body;

  const course = await courseModel.findOne({
    _id: courseId,
    creatorId: adminId,
  });

  if (!course) {
    res.json({
      message: "Course not found!",
    });
  }

  await courseModel.updateOne(
    {
      _id: courseId,
      creatorId: adminId,
    },
    {
      title: title,
      description: description,
      imageUrl: imageUrl,
      price: price,
    }
  );
  res.json({
    message: "Course updated!",
  });
});

// delete the course

adminRouter.delete("/delete", adminMiddleware, async function (req, res) {
  const adminId = req.adminId;

  // input validation
  const requireBody = z.object({
    courseId: z.string().min(5),
  });

  // parsing the data

  const parsingDataWithSuccess = requireBody.safeParse(req.body);

  if (!parsingDataWithSuccess.success) {
    res.json({
      message: "Incorrect format!",
    });
  }
  const { courseId } = req.body;

  const course = await courseModel.findOne({
    _id: courseId,
    creatorId: adminId,
  });

  if (!course) {
    res.json({
      message: "Course not found!",
    });
  }

  await courseModel.deleteOne({
    _id: courseId,
    creatorId: adminId,
  });
  res.json({
    message: "Course deleted!",
  });
});

// list all the courses

adminRouter.get("/course/bulk", adminMiddleware, async function (req, res) {
  const adminId = req.adminId;
  const courses = await courseModel.findOne({
    creatorId: adminId,
  });
  res.json({
    Courses: courses,
  });
});

module.exports = {
  adminRouter: adminRouter,
};
