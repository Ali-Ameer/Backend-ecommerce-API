const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");
const credentials = require("./config/credentials");
const mongoose = require("mongoose");
require("dotenv").config();

const AuthController = require("./auth/AuthController");
const User = require("./routes/user");
const Product = require("./routes/product");
const Contact = require("./routes/contact");
const Order = require("./routes/order");
const Notification = require("./routes/notification");
const Image = require("./routes/image");
const StripePayment = require("./routes/stripe/stripePayment");
const StripeWebhook = require("./routes/stripe/stripeWebhook");
const NotificationModels = require("./models/Notification");

// express app
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000/",
//   },
// });

app.use(cookieParser());

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);
app.use(cors(corsOptions));;

app.use(express.urlencoded({ extended: false }));

app.use("/api/checkout", StripeWebhook);

// middleware
app.use(express.json());
//enables us to host static CSS & JS files, public folder contains the CSS & JS files.
app.use(express.static("public"));

//Add this before the app.get() block
io.on("connection", (socket) => {
  console.log("socket: a user connected");

  // receive event from the client
  socket.on("sendUser", (data) => {
    let notificationInfo = {
      name: data.user.name,
      message: "is signup",
      notification: "you have a new user click to view details",
      id: data.user._id
    };
    NotificationModels.create(notificationInfo)
    console.log(notificationInfo);
    socket.broadcast.emit("receiveUser", notificationInfo)
  });

  socket.on("disconnect", () => {
    console.log("socket: a user disconnected");
  });
});
// server.listen(process.SERVER_WEBHOOK_PORT);

//Route to the homepage of the application
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

// routes
app.use("/api/auth", AuthController);
app.use("/api/user", User);
app.use("/api/product", Product);
app.use("/api/contact", Contact);
app.use("/api/order", Order);
app.use("/api/notification", Notification);
app.use("/api/image", Image);
app.use("/api/checkout", StripePayment);

// mongo connect & DB
mongoose
  .connect(process.env.MONGO_URL, { useUnifiedTopology: true })
  .then(() => {
    console.log("DB connect successfully ");
  })
  .catch((err) => {
    console.log(err);
  });

// listen for requests
app.listen(process.env.PORT || 8000, () => {
  console.log("server is running on port: 8000");
});

module.exports = app;