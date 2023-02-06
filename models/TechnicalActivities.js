var mongoose = require("mongoose");

var TechActivity = new mongoose.Schema({
  club: {
    type: String,
  },
  sdate: {
    type: Date,
  },
  edate: {
    type: Date,
  },
  desc: {
    type: String,
  },
  event: {
    type: String,
  },
  sid: {
    type: String,
  },
  sname: {
    type: String,
  },
  sdiv: {
    type: String,
  },
  sbatch: {
    type: String,
  },
  srollno: {
    type: Number,
  },
  file: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
});

module.exports = mongoose.model("TechnicalActivities", TechActivity);
