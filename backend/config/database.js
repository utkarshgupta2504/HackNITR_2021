const mongoose = require("mongoose");

const MONGO_URI =
  "mongodb+srv://usp:LetsWinThisThing@cluster0.ci4x0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};
