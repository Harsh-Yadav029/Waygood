const Program = require("../models/Program");
const asyncHandler = require("../utils/asyncHandler");

function parseBoolean(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

const listPrograms = asyncHandler(async (req, res) => {
  const {
    country,
    degreeLevel,
    intake,
    field,
    fieldOfStudy,
    q,
    maxTuition,
    scholarshipAvailable,
    sortBy = "relevance",
    page = 1,
    limit = 10,
  } = req.query;

  const filters = {};

  if (country) {
    filters.country = country;
  }

  if (degreeLevel) {
    filters.degreeLevel = degreeLevel;
  }

  const fieldSearch = field || fieldOfStudy;
  if (fieldSearch) {
    filters.fieldOfStudy = fieldSearch;
  }

  if (intake) {
    filters.intakes = intake;
  }

  if (maxTuition) {
    filters.tuitionFee = { $lte: Number(maxTuition) };
  }

  const scholarshipFlag = parseBoolean(scholarshipAvailable);
  if (typeof scholarshipFlag === "boolean") {
    filters.scholarshipAvailable = scholarshipFlag;
  }

  if (q) {
    filters.$or = [
      { title: { $regex: q, $options: "i" } },
      { universityName: { $regex: q, $options: "i" } },
      { fieldOfStudy: { $regex: q, $options: "i" } },
    ];
  }

  const pageNumber = Math.max(Number(page), 1);
  const pageSize = Math.min(Math.max(Number(limit), 1), 50);

  const sortMap = {
    tuitionAsc: { tuitionFee: 1 },
    tuitionDesc: { tuitionFee: -1 },
    relevance: { scholarshipAvailable: -1, tuitionFee: 1 },
  };

  const [items, total] = await Promise.all([
    Program.find(filters)
      .populate("university", "name country city qsRanking")
      .sort(sortMap[sortBy] || sortMap.relevance)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Program.countDocuments(filters),
  ]);

  const message = total > 0 
    ? `Successfully found ${total} programs matching your criteria.`
    : "We couldn't find any programs matching those filters. Try adjusting your search!";

  res.json({
    success: true,
    message,
    data: items,
    meta: {
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  });
});

const getProgramById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const program = await Program.findById(id).populate("university");

  if (!program) {
    throw new HttpError(404, "Program not found");
  }

  res.json({
    success: true,
    data: program,
  });
});

module.exports = {
  listPrograms,
  getProgramById,
};
