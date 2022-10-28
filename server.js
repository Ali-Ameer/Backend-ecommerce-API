const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");
const credentials = require("./config/credentials");
const mongoose = require("mongoose");
require("dotenv").config();

const AuthController = require("./auth/AuthController");
const User = require("./routes/User");
const Product = require("./routes/product");
const contact = require("./routes/contact");
const order = require("./routes/order");
const notification = require("./routes/notification");
const Image = require("./routes/image");
const stripePayment = require("./routes/stripe/stripePayment");
const stripeWebhook = require("./routes/stripe/stripeWebhook");
const Notification = require("./models/Notification");

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
    "http://localhost:3000",
    "http://localhost:8000",
    "Access-Control-Allow-Credentials: true"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

app.use(express.urlencoded({ extended: false }));

app.use("/api/checkout", stripeWebhook);

// middleware
app.use(express.json());
//enables us to host static CSS & JS files.
//The public folder contains the CSS & JS files.
app.use(express.static("public"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://ecommerce-website-bice.vercel.app/",
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
    Notification.create(notificationInfo)
    console.log(notificationInfo);
    socket.broadcast.emit("receiveUser", notificationInfo)
  });

  socket.on("disconnect", () => {
    console.log("socket: a user disconnected");
  });
});
server.listen(3500);

//Route to the homepage of the application
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

// routes
app.use("/api/auth", AuthController);
app.use("/api/user", User);
app.use("/api/product", Product);
app.use("/api/contact", contact);
app.use("/api/order", order);
app.use("/api/notification", notification);
app.use("/api/image", Image);
app.use("/api/checkout", stripePayment);

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
