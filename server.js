const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
app.use(cors({
  origin: "http://localhost:5173", 

}));

const port = process.env.PORT || 7000;
const authRoutes = require("./routes/authRoutes")
const connectDb = require("./config/dbconfig");
app.use(express.json());
app.use("/api",authRoutes)
connectDb()
  .then(() => {
    console.log("MongoDb connected Successfully");
  })
  .catch((error) => {
    console.error("Database Connection Failed", error);
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
