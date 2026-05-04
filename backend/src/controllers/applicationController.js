const Application = require("../models/Application");
const Program = require("../models/Program");
const { VALID_TRANSITIONS } = require("../utils/statusTransitions");
const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");

const listApplications = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filters = {};

  // Role-based visibility
  if (req.user.role === "student") {
    filters.student = req.user._id;
  }

  if (status) {
    filters.status = status;
  }

  const applications = await Application.find(filters)
    .populate("student", "fullName email role")
    .populate("program", "title degreeLevel tuitionFee")
    .populate("university", "name country city")
    .sort({ createdAt: -1 })
    .lean();

  res.json({
    success: true,
    data: applications,
  });
});

const createApplication = asyncHandler(async (req, res) => {
  const { programId, intake } = req.body;
  const studentId = req.user._id;

  // Verify program exists
  const program = await Program.findById(programId);
  if (!program) {
    throw new HttpError(404, "We couldn't find the program you're looking for.");
  }

  // Check for existing application
  const existing = await Application.findOne({ student: studentId, program: programId });
  if (existing) {
    throw new HttpError(409, "You have already started an application for this program! You can track its progress on your dashboard.");
  }

  const application = await Application.create({
    student: studentId,
    program: programId,
    university: program.university,
    destinationCountry: program.country,
    intake,
    status: "applied",
    timeline: [
      {
        status: "applied",
        note: `Great choice! You successfully submitted your application for the ${intake} intake.`,
      },
    ],
  });

  res.status(201).json({
    success: true,
    message: "Your application has been submitted successfully! Good luck!",
    data: application,
  });
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status: newStatus, note } = req.body;

  const application = await Application.findById(id);
  if (!application) {
    throw new HttpError(404, "Application not found.");
  }

  const currentStatus = application.status;

  // Enforce state machine transitions
  if (!VALID_TRANSITIONS[currentStatus] || !VALID_TRANSITIONS[currentStatus].includes(newStatus)) {
    throw new HttpError(400, `The application is currently '${currentStatus}'. It needs to be 'Under Review' before it can move to '${newStatus}'.`);
  }

  // Human-friendly default notes
  const defaultNotes = {
    "under-review": "Admissions team has officially started reviewing your profile and documents.",
    "accepted": "Congratulations! You have been accepted into this program.",
    "rejected": "We regret to inform you that your application was not successful at this time.",
    "withdrawn": "The application has been withdrawn as per your request."
  };

  // Update status and timeline
  application.status = newStatus;
  application.timeline.push({
    status: newStatus,
    note: note || defaultNotes[newStatus] || `Status updated to ${newStatus}`,
    changedAt: new Date(),
  });

  await application.save();

  res.json({
    success: true,
    message: `Application status updated to ${newStatus}.`,
    data: application,
  });
});

module.exports = {
  createApplication,
  listApplications,
  updateApplicationStatus,
};
