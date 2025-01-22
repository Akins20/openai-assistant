import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { email, password, role, adminCode } = req.body;

    // Validate admin code for admin signup
    if (role === "admin" && adminCode !== "anything") {
      return res.status(403).json({ message: "Invalid admin code" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({ email, password: hashedPassword, role });
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { email: user.email, userId: user._id, role: user.role },
      process.env.JWT_SECRET || "myjwtsecretkey",
      { expiresIn: "1h" }
    );

    res.status(201).json({ token, userId: user._id, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Validate password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { email: user.email, userId: user._id, role: user.role },
      process.env.JWT_SECRET || "myjwtsecretkey",
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, userId: user._id, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
