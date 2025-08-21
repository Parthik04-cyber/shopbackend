import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    // Verify token with error handling
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Check if it's an admin token
    if (!decodedToken.admin) {
      return res.status(401).json({ success: false, message: "Access denied. Admin privileges required." });
    }

    // Verify admin email
    if (decodedToken.email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ success: false, message: "Access denied. Invalid admin." });
    }

    // Add admin info to request for potential use in routes
    req.admin = {
      email: decodedToken.email,
      isAdmin: true
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: "Token expired. Please login again." });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: "Invalid token." });
    }
    
    console.error("Admin auth error:", error);
    return res.status(500).json({ success: false, message: "Authentication failed." });
  }
};

export default adminAuth;
