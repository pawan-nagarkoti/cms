import mongoose from "mongoose";

const connectToDB = async () => {
  const connectionUrl = process.env.MONGODB_URL;

  mongoose
    .connect(connectionUrl)
    .then(() => console.log("blog database connection is successfull"))
    .catch((error) => console.log(error));
};

export default connectToDB;
