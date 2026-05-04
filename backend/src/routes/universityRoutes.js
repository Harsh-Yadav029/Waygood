const express = require("express");

const {
  getUniversityById,
  listPopularUniversities,
  listUniversities,
} = require("../controllers/universityController");

const router = express.Router();

router.get("/", listUniversities);
router.get("/popular", listPopularUniversities);
router.get("/:id", getUniversityById);

module.exports = router;
