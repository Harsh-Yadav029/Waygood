const express = require("express");
const recommendationController = require("../controllers/recommendationController");
const { requireAuth } = require("../middleware/auth");
const requireRole = require("../middleware/role.middleware");

const router = express.Router();

// Get recommendations for the logged-in student
router.get("/", requireAuth, recommendationController.getRecommendations);

// Get recommendations for a specific student (Counselor only)
router.get("/:studentId", requireAuth, requireRole("counselor"), recommendationController.getRecommendations);

module.exports = router;
