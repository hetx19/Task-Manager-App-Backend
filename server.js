// Configuring Enviroment Variables
require("dotenv").config();
const express = require("express");
const cors = require("cors");

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

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(
    `Task manager server is successfully running on at http://localhost:${port}`
  );
});
