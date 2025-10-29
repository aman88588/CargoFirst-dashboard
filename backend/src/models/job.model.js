const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
    trim: true,
  },
  jobDescription: {
    type: String,
    required: true,
    trim: true,
  },
  lastDateToApply: {
    type: Date,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
});

const JobModel = mongoose.model("jobs", JobSchema);

module.exports = JobModel;
