const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");
const { buildProgramRecommendations } = require("../services/recommendationService");

const getRecommendations = asyncHandler(async (req, res) => {
  // Use studentId from params if available (for counselors), 
  // otherwise use the authenticated user's ID
  const studentId = req.params.studentId || req.user._id;

  // Security check: if user is a student, they can only see their own recommendations
  if (req.user.role === "student" && req.user._id.toString() !== studentId.toString()) {
    throw new HttpError(403, "Access denied: You can only view your own recommendations");
  }

  const payload = await buildProgramRecommendations(studentId);

  res.json({
    success: true,
    ...payload,
  });
});

module.exports = {
  getRecommendations,
};
