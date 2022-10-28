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

const http = require("http");
const { Server } = require("socket.io");

// express app
const app = express();

app.use(cookieParser());

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers, "*", Access-Control-Allow-Origin',
    "Origin, X-Requested-with, Content_Type,Accept,Authorization",
    process.WEBHOOK_ORIGIN,
    process.env.ALLOWED_ORIGINS_1,
    process.env.ALLOWED_ORIGINS_2,
    "http://localhost:8000",
    "https://backend-ecommerce-api.onrender.com/",
    "Access-Control-Allow-Credentials: true"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});
app.use((req, res, next) => {
  const allowedOrigins = [process.env.ALLOWED_ORIGINS_1, process.env.ALLOWED_ORIGINS_2];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  return next();
})
app.use(express.urlencoded({ extended: false }));

app.use("/api/checkout", StripeWebhook);

// middleware
app.use(express.json());
//enables us to host static CSS & JS files.
//The public folder contains the CSS & JS files.
app.use(express.static("public"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.WEBHOOK_ORIGIN,
  },
});

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
server.listen(process.SERVER_WEBHOOK_PORT);

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