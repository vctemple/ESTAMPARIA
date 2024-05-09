import mongoose from "mongoose";

const schemaBanner = new mongoose.Schema(
  {
    img_banner: String,
  },
  { timestamps: true }
);

export default mongoose.model("Banner", schemaBanner);
