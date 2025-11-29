import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, isBlocked: user.isBlocked }, // Include isBlocked in the token payload
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

export default generateToken;
