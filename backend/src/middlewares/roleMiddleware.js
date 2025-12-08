// backend/src/middlewares/roleMiddleware.js

export function allowRoles(...allowedRoles) {
  return (req, res, next) => {
    if (req.user == null) { // Use == null to check for both null and undefined
      return res.status(401).json({ message: "Not authorized" });
    }

    if (req.user.isBlocked) {
      return res.status(403).json({ message: "Access denied. Your account is blocked." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
}
