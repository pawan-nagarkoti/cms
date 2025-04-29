import mongoose from "mongoose";

const OtherInformationSchema = new mongoose.Schema(
  {
    geoRegion: {
      type: String,
    },
    geoPostion: {
      type: String,
    },
    geoPlacename: {
      type: String,
    },
    youtubeLink: {
      type: String,
    },
    icbm: {
      type: String,
    },
    projectID: {
      type: String,
    },
  },
  { timestamps: true }
);

const OtherInformation = mongoose.models.OtherInformation || mongoose.model("OtherInformation", OtherInformationSchema);

export default OtherInformation;
