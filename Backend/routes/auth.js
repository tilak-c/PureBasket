import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password });

    const safeUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone || ""
    };

    res.status(201).json({ message: "Registered", user: safeUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const safeUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone || ""
    };

    res.json({ message: "Login successful", user: safeUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
