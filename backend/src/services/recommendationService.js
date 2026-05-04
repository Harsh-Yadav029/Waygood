const Program = require("../models/Program");
const Student = require("../models/Student");
const HttpError = require("../utils/httpError");

function calculateScore(student, program) {
  let score = 0;
  const reasons = [];

  if (student.targetCountries.includes(program.country)) {
    score += 35;
    reasons.push(`Preferred country match: ${program.country}`);
  }

  if (
    student.interestedFields.some((field) =>
      program.fieldOfStudy.toLowerCase().includes(field.toLowerCase())
    )
  ) {
    score += 30;
    reasons.push(`Field alignment: ${program.fieldOfStudy}`);
  }

  if (student.maxBudgetUsd >= program.tuitionFee) {
    score += 20;
    reasons.push("Within budget range");
  }

  if (student.preferredIntake && program.intakes.includes(student.preferredIntake)) {
    score += 10;
    reasons.push(`Preferred intake available: ${student.preferredIntake}`);
  }

  if ((student.englishTest?.score || 0) >= program.ieltsRequirement) {
    score += 5;
    reasons.push("English test score meets requirement");
  }

  return {
    score,
    reasons,
  };
}

async function buildProgramRecommendations(studentId) {
  const student = await Student.findById(studentId).lean();

  if (!student) {
    throw new HttpError(404, "Student not found.");
  }

  // Define student variables for the aggregation pipeline
  const studentBudget = student.maxBudgetUsd || Infinity;
  const studentIelts = student.englishTest?.score || 0;
  const studentIntake = student.preferredIntake;
  const studentCountries = student.targetCountries || [];
  const studentFields = student.interestedFields || [];

  const recommendations = await Program.aggregate([
    // 1. Initial Match (Hard filters as requested)
    {
      $match: {
        $and: [
          studentIntake ? { intakes: studentIntake } : {},
          { tuitionFee: { $lte: studentBudget } },
          { ieltsRequirement: { $lte: studentIelts } },
        ],
      },
    },
    // 2. Join with University
    {
      $lookup: {
        from: "universities",
        localField: "university",
        foreignField: "_id",
        as: "university",
      },
    },
    { $unwind: "$university" },
    // 3. Compute matchScore and matchReasons with Humanized Weights
    {
      $addFields: {
        matchScore: {
          $add: [
            { $cond: [{ $in: ["$country", studentCountries] }, 35, 0] },
            { $cond: [{ $in: ["$fieldOfStudy", studentFields] }, 30, 0] },
            { $cond: [{ $lte: ["$tuitionFee", studentBudget] }, 20, 0] },
            { $cond: [{ $in: [studentIntake, "$intakes"] }, 10, 0] },
            { $cond: [{ $lte: ["$ieltsRequirement", studentIelts] }, 5, 0] },
          ],
        },
        matchReasons: {
          $concatArrays: [
            { $cond: [{ $in: ["$country", studentCountries] }, [{ $concat: ["Top match for your target country: ", "$country"] }], []] },
            { $cond: [{ $in: ["$fieldOfStudy", studentFields] }, [{ $concat: ["Perfect alignment with your interest in ", "$fieldOfStudy"] }], []] },
            { $cond: [{ $lte: ["$tuitionFee", studentBudget] }, ["Safely within your budget range"], []] },
            { $cond: [{ $in: [studentIntake, "$intakes"] }, [{ $concat: ["Available for your preferred ", studentIntake, " intake"] }], []] },
            { $cond: [{ $lte: ["$ieltsRequirement", studentIelts] }, ["Your English scores meet the requirements"], []] },
          ],
        },
      },
    },
    // 4. Sort and Limit
    { $sort: { matchScore: -1, "university.qsRanking": 1 } },
    { $limit: 12 },
  ]);

  return {
    data: {
      student: {
        id: student._id,
        fullName: student.fullName,
      },
      recommendations,
    },
    meta: {
      total: recommendations.length,
      implementation: "mongodb-aggregation",
    },
  };
}

module.exports = {
  buildProgramRecommendations,
};
