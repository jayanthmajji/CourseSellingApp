const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;
const schema = mongoose.Schema;

const userSchema = new schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
  firstname: String,
  lastname: String,
});

const adminSchema = new schema({
  email: { type: String, unique: true },
  password: String,
  firstname: String,
  lastname: String,
});

const courseSchema = new schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  creatorId: objectId,
});

const purchaseSchema = new schema({
  userId: objectId,
  creatorId: objectId,
});

const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const courseModel = mongoose.model("course", courseSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);

module.exports = {
  userModel,
  adminModel,
  courseModel,
  purchaseModel,
};
