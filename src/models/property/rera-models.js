import mongoose from "mongoose";

const ReraSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    number: {
      type: String,
    },
    url: {
      type: String,
    },
    image: {
      type: String,
    },
    projectID: {
      type: String,
    },
  },
  { timestamps: true }
);

const Rera = mongoose.models.Rera || mongoose.model("Rera", ReraSchema);

export default Rera;
