const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const bcrypt = require("bcrypt");

const SALT_ROUNDS = 12;


if (!JWT_SECRET_KEY) {
    console.error('JWT_SECRET_KEY is not configured in .env');
    process.exit(1);
}

const generateToken = (userId, email, role) => {
  return jwt.sign(
    {
      userId: userId.toString(),
      email,
      role,
    },
    JWT_SECRET_KEY,
    { expiresIn: "24h" }
  );
};

const isValidEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
  return passwordRegex.test(password);
};

const hashPassword = async (password) => {
    try {
      const hashed = await bcrypt.hash(password, SALT_ROUNDS);
      return hashed;
    } catch (error) {
      console.error("Error hashing password:", error);
      throw error;
    }
  };
  
  // 🔎 Compare password (for login)
  const comparePassword = async (password, hashedPassword) => {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error("Error comparing password:", error);
      throw error;
    }
};

module.exports = {
  generateToken,
  isValidEmail,
  isValidPassword,
  hashPassword,
  comparePassword,
};
