import jwt from "jsonwebtoken";

export const adminAuth = (req, res, next) => {
  try {
    const authHeader =
      req.header("Authorization") || req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Admin Auth - No valid authorization header");
      return res.status(401).json({
        success: false,
        error: {
          code: "NO_TOKEN",
          message: "No token, authorization denied",
        },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    console.log("Admin Auth - Token found");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Admin Auth - Decoded role:", decoded.role);

    if (decoded.role !== "admin") {
      console.log("Admin Auth - Access denied, user role is:", decoded.role);
      return res.status(403).json({
        success: false,
        error: {
          code: "NOT_ADMIN",
          message: "Access denied. Admin privileges required.",
        },
      });
    }

    console.log("Admin Auth - Success! Admin access granted");
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Admin auth error:", error.message);
    res.status(401).json({
      success: false,
      error: {
        code: "INVALID_TOKEN",
        message: "Token is not valid",
      },
    });
  }
};
