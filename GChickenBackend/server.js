// /*
// Setting ub Backend Server page for your react app
// */
// // Require all the things to handle for the backend of the server
// const express = require('express')
// const cors = require('cors')
// //to connect to our MongoDB database:
// const mongoose = require('mongoose');

// const cookieParser = require('cookie-parser');

// //this configures how we can have our env variables in .env file
// require('dotenv').config();

// //configuring our express server
// const app = express();
// const port = process.env.PORT || 5000;

// app.use(cookieParser());

// app.use(
//   cors({
//     origin: ["http://localhost:3000","https://g-chickenn.vercel.app"],
//     credentials: true
//   })
// );

// app.use(express.json());

// //To connect to our MongoDB database
// const uri = process.env.ATLAS_URI;
// mongoose.connect(uri);
// const connection = mongoose.connection;
// connection.once('open', () => { console.log("MongoDB database connection established sucessfully") });

// //using our created routes:
// const userRouter = require('./routes/user-route');
// const itemsRouter = require('./routes/items-route');
// const authuserRoutes = require('./routes/authorization');
// const orderRouter = require("./routes/order-route");

// app.use('/user',userRouter);
// app.use('/items',itemsRouter);
// app.use('/api',authuserRoutes);
// app.use("/orders", orderRouter);
// //this app starts the server on listening on the port specified above
// app.listen(port, () => {
//     console.log(`Server is running on port: ${port}`);
// });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "https://g-chickenn.vercel.app",
  "https://www.gchickenn.in/"
];

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true
  })
);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Routes
const userRouter = require("./routes/user-route");
const itemsRouter = require("./routes/items-route");
const authuserRoutes = require("./routes/authorization");
const orderRouter = require("./routes/order-route");

app.use("/user", userRouter);
app.use("/items", itemsRouter);
app.use("/api", authuserRoutes);
app.use("/orders", orderRouter);

// Debug checks
if (!process.env.ATLAS_URI) {
  console.error("ATLAS_URI is missing in environment variables");
  process.exit(1);
}

mongoose
  .connect(process.env.ATLAS_URI)
  .then(() => {
    console.log("MongoDB database connection established successfully");

    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});