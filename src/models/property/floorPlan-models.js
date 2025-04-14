import mongoose from "mongoose";

const FaqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
    },
    answer: {
      type: String,
    },
  },
  { timestamps: true }
);

const Faq = mongoose.models.Faq || mongoose.model("Faq", FaqSchema);

export default Faq;
