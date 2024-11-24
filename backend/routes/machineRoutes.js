const express = require("express");
const { getMachines, addMachine, deleteMachine } = require("../controllers/machineController");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Middleware to check token
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

router.get("/", authenticate, getMachines);
router.post("/", authenticate, addMachine);
router.delete("/:id", authenticate, deleteMachine);

module.exports = router;
