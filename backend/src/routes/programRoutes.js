const express = require("express");

const { getProgramById, listPrograms } = require("../controllers/programController");

const router = express.Router();

router.get("/", listPrograms);
router.get("/:id", getProgramById);

module.exports = router;
