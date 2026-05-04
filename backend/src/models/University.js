const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      index: true,
    },
    city: {
      type: String,
      required: true,
    },
    partnerType: {
      type: String,
      enum: ["direct", "recruitment-partner", "institution-partner"],
      default: "direct",
    },
    qsRanking: Number,
    scholarshipAvailable: {
      type: Boolean,
      default: false,
    },
    popularScore: {
      type: Number,
      default: 0,
      index: true,
    },
    tags: [String],
    fieldOfStudy: {
      type: [String],
      default: [],
      index: true,
    },
    intakes: {
      type: [String],
      default: [],
      index: true,
    },
    websiteUrl: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for programs belonging to this university
universitySchema.virtual("programs", {
  ref: "Program",
  localField: "_id",
  foreignField: "university",
});

// Individual indexes are already defined in the schema fields
universitySchema.index({ name: "text", country: "text", city: "text" });

module.exports = mongoose.model("University", universitySchema);
