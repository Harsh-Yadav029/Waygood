const express = require("express");

const {
  createApplication,
  listApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const { requireAuth } = require("../middleware/auth");
const requireRole = require("../middleware/role.middleware");

const router = express.Router();

router.get("/", requireAuth, listApplications);
router.post("/", requireAuth, createApplication);
router.patch("/:id/status", requireAuth, requireRole("counselor"), updateApplicationStatus);

module.exports = router;
