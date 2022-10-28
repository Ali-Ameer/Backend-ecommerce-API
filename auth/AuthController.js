const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var mongoose = require("mongoose");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");

// register & sing up new user
router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    })
    newUser
      .save()
      .then((user) => { res.status(200).json({ ...user._doc }) })
      .catch((err) => {
        res.status(500).json({ message: "cant't create new user", err });
      });

  } catch (error) {
    res.status(500).json({error, message: "something went wrong please try again"})
  }
});

// create new refresh token
router.get("/refreshToken", async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken)
    return res.status(401).json({ message: "no cookies found!" });
  const refreshToken = cookies.refreshToken;
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  // compare refresh token !
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "invalid token!", err }); //Forbidden

      // Refresh token was still valid
      const accessToken = jwt.sign(
        { email: decoded.email, role: decoded.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      const newRefreshToken = jwt.sign(
        { email: decoded.email, role: decoded.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );
      // Creates Secure Cookie with refresh token
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken });
    }
  );
});

// login user
router.post("/login", async (req, res) => {
  const cookies = req.cookies;
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required." });

  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser)
    return res.sendStatus(401).json({ message: "no user found!" }); //Unauthorized

  // evaluate password
  const matchPassword = await bcrypt.compare(password, foundUser.password);
  if (matchPassword) {
    const accessToken = jwt.sign(
      { email: foundUser.email, role: foundUser.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const newRefreshToken = jwt.sign(
      { email: foundUser.email, role: foundUser.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    if (cookies?.refreshToken) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    }

    // Creates Secure Cookie with refresh token
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // don't send password to user
    const { password, ...others } = foundUser._doc;
    // Send authorization roles and access token to user
    res.status(200).json({ accessToken, others });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
