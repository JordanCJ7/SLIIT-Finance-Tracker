const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  // Check if the token is in the Authorization header
  const authHeader = req.header("Authorization");

  // If the header is missing or does not start with 'Bearer ', return 401 Unauthorized
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied: No token provided" });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the JWT secret (from environment variable)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user data to the request object for access in later middleware/routes
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle token expiration error
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token Expired" });
    }

    // Handle invalid token
    res.status(401).json({ message: "Invalid Token" });
  }
};
