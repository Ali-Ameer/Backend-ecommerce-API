const jwt = require("jsonwebtoken");

const VerifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "invalid token", err });
    req.user = user;
    next();
  });
};

const UserRole = (req, res, next) => {
  VerifyToken(req, res, () => {
    if (
     req.user.role === "User" ||
      req.user.role === "Editor" ||
      req.user.role === "Admin"
    ) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
      
    }
  });
};

const EditorRole = (req, res, next) => {
  VerifyToken(req, res, () => {
    if (req.user.role === "Editor" || req.user.role === "Admin") {
      next();
    } else {
      res.status(403).json("You are not allowed to do that! must be Editor or Admin");
    }
  });
};

const AdminRole = (req, res, next) => {
  VerifyToken(req, res, () => {
    if (req.user.role === "Admin") {
      next();
    } else {
      res.status(403).json("You are not allowed to do that! must be Admin");
    }
  });
};

module.exports = { VerifyToken, UserRole, EditorRole, AdminRole };
