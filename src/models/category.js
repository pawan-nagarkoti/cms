import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: String,
  index: String,
  status: String,
});

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

export default Category;
