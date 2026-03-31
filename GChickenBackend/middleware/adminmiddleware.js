// adminmiddleware
// middleware/admin.js

const adminOnly = (req, res, next) => {
    // req.user comes from your auth middleware
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next(); // ✅ allow access
};

module.exports = adminOnly;