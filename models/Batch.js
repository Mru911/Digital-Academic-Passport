var mongoose = require("mongoose");

var BatchSchema = new mongoose.Schema(
  {
    batch_name: {
      type: String,
      required: true,
    },
    guardian_id: {
      type: String,
      required: true,
    },
    guardian_teacher: {
      name: {
        type: String,
      },
      mobile: {
        type: String,
      },
      email: {
        type: String,
      },
    },
    batch_div: {
      type: String,
      required: true,
    },
    batch_branch: {
      type: String,
      required: true,
    },
    batch_Students: {
      type: Array,
      default: [],
    },
    student_mails:{
      type: Array,
      default: []
    },
    parent_mails:{
      type: Array,
      default: []
    },
    batch_Students_Parents: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Batches", BatchSchema);
