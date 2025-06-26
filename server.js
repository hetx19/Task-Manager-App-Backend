// Configuring Enviroment Variables
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDb = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const taskRoute = require("./routes/taskRoute");
const reportRoute = require("./routes/reportRoute");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

connectDb();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoute);
app.use("/api/task", taskRoute);
app.use("/api/report", reportRoute);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"), (error) => {
    if (error) {
      console.log("Error sending file:", error);
      res.status(500).send("File not found");
    }
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(
    `Task manager server is successfully running on at http://localhost:${port}`
  );
});
